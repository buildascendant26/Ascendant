import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Persistent particle-sphere background — a Fibonacci-distributed globe of
 * additively-blended sparks, centered off-screen so only its near limb
 * sweeps through the frame (the same "glowing curved edge" look as the
 * reference shot, not a centered planet).
 *
 * Scroll progress (0..1 over the whole page) drives a camera dolly into the
 * globe and a bounded rotation; stopping scroll fades into a slow idle
 * "breathe" pulse. Mirrors the lifecycle/perf conventions already used by
 * ShaderBackground/ScrollBackground in this codebase: refs for all hot-path
 * state (no re-renders), capped DPR, context-loss handling, full teardown on
 * unmount, and a pause whenever the tab is hidden.
 */

const SPHERE_RADIUS = 6.5;
const SPHERE_CENTER = new THREE.Vector3(6.6, 0.2, -1.0);
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const FACE_DIR = new THREE.Vector3(-0.55, 0, 0.85).normalize();

const CAMERA_FAR_Z = 9.0;
const CAMERA_NEAR_Z = 4.0;

const ROT_SPEED = 0.05;
const BREATHE_AMOUNT = 0.04;
const BREATHE_SPEED = 0.3;
const SCROLL_AMOUNT = 1.4;
const PARTICLE_SIZE_MUL = 2.2;
const DUST_AMOUNT = 0.55;
const SHELL_JITTER = 0.05; // tighter than the original 0.08 -> denser-looking shell

const IDLE_MS = 500;

function particleCountFor(width: number) {
  // Denser globe than the original demo (22k), scaled down on narrow
  // viewports where weaker mobile GPUs need to hit the same frame budget.
  return width < 768 ? 12000 : 34000;
}

export default function ParticleSphereBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particleCount = particleCountFor(window.innerWidth);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // additive point sprites don't benefit from MSAA
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, CAMERA_FAR_Z);
    camera.lookAt(0, 0, 0);

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const seeds = new Float32Array(particleCount);

    // Fixed seed: the dust/size scatter is identical on every load instead
    // of reshuffling the composition on each page refresh.
    let prngState = 1337;
    const nextRandom = () => {
      prngState = (prngState * 1664525 + 1013904223) >>> 0;
      return prngState / 4294967296;
    };
    for (let i = 0; i < particleCount; i++) {
      const sizeSeed = nextRandom();
      sizes[i] = 1.1 * (0.4 + 1.1 * Math.pow(sizeSeed, 3));
      seeds[i] = nextRandom();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelScale: { value: 1 },
        uSizeMultiplier: { value: PARTICLE_SIZE_MUL },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aAngle;
        attribute vec3 color;
        uniform float uPixelScale;
        uniform float uSizeMultiplier;
        varying vec3 vColor;
        varying float vAngle;
        void main() {
          vColor = color;
          vAngle = aAngle;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float computedSize = aSize * uSizeMultiplier * uPixelScale / max(-mvPosition.z, 0.001);
          gl_PointSize = min(computedSize, 38.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAngle;
        void main() {
          vec2 uv = (gl_PointCoord - vec2(0.5)) * 2.0;
          float c = cos(vAngle);
          float s = sin(vAngle);
          vec2 ruv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
          float d = length(ruv);

          float core = exp(-d * d * 11.0);
          float arm1 = exp(-(ruv.y * ruv.y) * 60.0) * exp(-(ruv.x * ruv.x) * 1.6);
          float arm2 = exp(-(ruv.x * ruv.x) * 60.0) * exp(-(ruv.y * ruv.y) * 1.6);
          float flare = (arm1 + arm2) * 0.5;

          float alpha = clamp(core + flare, 0.0, 1.0) * smoothstep(1.0, 0.0, d);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(rafRef.current);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const pixelScale = h / 70;
      material.uniforms.uPixelScale.value =
        pixelScale * Math.min(window.devicePixelRatio || 1, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    const sharedTarget = new THREE.Vector3();
    const sharedColor = new THREE.Color();

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let idleTime = 999;
    let breatheMix = 0;
    let lastScrollTime = performance.now();

    let frameThetaOffset = 0;
    let frameBreathe = 1;
    let frameScrollFlash = 0;

    const rafRef = { current: 0 };
    let running = true;

    const tick = () => {
      if (!running) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.elapsedTime;

      const now = performance.now();
      const sy = window.scrollY;
      const rawDelta = sy - lastScrollY;
      lastScrollY = sy;
      if (Math.abs(rawDelta) > 0.05) lastScrollTime = now;
      scrollVelocity += (rawDelta - scrollVelocity) * Math.min(1, dt * 8);

      idleTime = now - lastScrollTime > IDLE_MS ? idleTime + dt : 0;
      const idleTarget = idleTime > 0 ? 1 : 0;
      breatheMix += (idleTarget - breatheMix) * Math.min(1, dt * 1.5);

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const scrollProgress = Math.min(1, Math.max(0, sy / maxScroll));
      const targetCamZ =
        CAMERA_FAR_Z - scrollProgress * (CAMERA_FAR_Z - CAMERA_NEAR_Z);
      camera.position.z += (targetCamZ - camera.position.z) * Math.min(1, dt * 2.5);

      const scrollPunch = Math.tanh(scrollVelocity / 40);
      frameThetaOffset =
        time * ROT_SPEED +
        scrollProgress * SCROLL_AMOUNT * 0.6 +
        scrollPunch * SCROLL_AMOUNT * 0.4;
      frameBreathe =
        1 + Math.sin(time * BREATHE_SPEED * Math.PI * 2) * BREATHE_AMOUNT * breatheMix;
      frameScrollFlash = Math.abs(scrollPunch) * 0.25 * (1 - breatheMix * 0.5);

      for (let i = 0; i < particleCount; i++) {
        const seed = seeds[i];

        const yN = 1 - (i / (particleCount - 1)) * 2;
        const rY = Math.sqrt(Math.max(0, 1 - yN * yN));
        const theta = GOLDEN_ANGLE * i + frameThetaOffset;
        const sx = Math.cos(theta) * rY;
        const sz = Math.sin(theta) * rY;
        const sy2 = yN;

        const dustKick = Math.pow(Math.max(0, seed - 0.82) / 0.18, 2) * DUST_AMOUNT;
        const shell = 1 + (seed - 0.5) * SHELL_JITTER + dustKick * 0.55;
        const r = SPHERE_RADIUS * shell * frameBreathe;

        const wobblePhase = time * (0.8 + seed * 2.6) + seed * 6.2831853;
        const wobbleAmt = 0.05 + seed * 0.05;
        const wx = Math.cos(wobblePhase) * wobbleAmt;
        const wy = Math.sin(wobblePhase * 1.3) * wobbleAmt;
        const wz = Math.sin(wobblePhase) * wobbleAmt;

        sharedTarget.set(
          SPHERE_CENTER.x + sx * r + wx,
          SPHERE_CENTER.y + sy2 * r + wy,
          SPHERE_CENTER.z + sz * r + wz
        );

        const spinSpeed = 1.4 + seed * 5.5;
        const spinDir = (i & 1) === 0 ? 1 : -1;
        angles[i] = wobblePhase * 0.4 + time * spinSpeed * spinDir;

        const facing = sx * FACE_DIR.x + sy2 * FACE_DIR.y + sz * FACE_DIR.z;
        const litness = Math.max(0, Math.min(1, 0.55 + facing * 0.6));
        const twinkle = 0.8 + 0.2 * Math.sin(time * 1.6 + seed * 6.2831853);
        const dustDim = 1 - Math.min(1, dustKick) * 0.45;

        const hue = 0.47 + facing * 0.02;
        const sat = 0.55 + litness * 0.25;
        const light = Math.max(
          0.03,
          Math.min(1, (0.14 + litness * 0.88) * twinkle * dustDim + frameScrollFlash)
        );
        sharedColor.setHSL(hue, sat, light);

        positions[i * 3] = sharedTarget.x;
        positions[i * 3 + 1] = sharedTarget.y;
        positions[i * 3 + 2] = sharedTarget.z;
        colors[i * 3] = sharedColor.r;
        colors[i * 3 + 1] = sharedColor.g;
        colors[i * 3 + 2] = sharedColor.b;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.aAngle.needsUpdate = true;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafRef.current);
      } else if (!running) {
        running = true;
        clock.getDelta(); // drop the paused-time gap
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        // z-index 0 (not -1): negative z renders behind the opaque <body> bg.
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        backgroundColor: "#000000",
      }}
    />
  );
}
