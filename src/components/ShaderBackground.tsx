import { useEffect, useRef } from "react";

/**
 * Procedural scroll-driven background — a cyan spiral galaxy rendered in real
 * time by a WebGL fragment shader. No video, no image frames: it's ~3KB of code
 * instead of 12MB of WebP, resolution-independent and instant-loading.
 *
 * Scroll position (0 -> 1) drives a uniform that zooms into the galaxy core
 * (swirl -> tunnel) and winds the spiral; the shader's own clock keeps the arms
 * turning and nebula drifting. When you stop scrolling it "breathes" — a slow
 * sine nudge on the zoom — and snaps back to scroll-driven motion instantly.
 *
 * All hot-path state lives in refs; the component never re-renders.
 */

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_scroll;   // 0..1 eased scroll progress

// --- hash / value noise / fbm --------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i),
        b = hash(i + vec2(1.0, 0.0)),
        c = hash(i + vec2(0.0, 1.0)),
        d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  // Center, aspect-correct coords.
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  // Scroll zooms us from a wide swirl into the bright core (a tunnel).
  float z = mix(1.45, 0.40, smoothstep(0.0, 1.0, u_scroll));
  uv *= z;

  float r = length(uv);
  float a = atan(uv.y, uv.x);

  // Global slow rotation from the clock, accelerated by scroll.
  float t = u_time * 0.06 + u_scroll * 2.5;

  // Log-spiral arms (two-armed galaxy).
  float twist = 4.5;
  float wind  = a + twist * log(r + 0.02) - t * 1.8;
  float arms  = sin(2.0 * wind) * 0.5 + 0.5;

  // Nebula clouds dragged along the same spiral coordinate.
  vec2  flow   = vec2(cos(wind), sin(wind)) * (r * 2.2);
  float clouds = fbm(flow + t * 0.5);

  // Arm density, fading toward the rim.
  float falloff = smoothstep(1.25, 0.0, r);
  float density = pow(arms, 1.6) * clouds * falloff;

  // Bright pulsing core.
  float core = 0.045 / (r + 0.03);
  core *= 0.85 + 0.15 * sin(u_time * 0.8);

  // Palette — teal/cyan arms over a deep blue void.
  vec3 cyan = vec3(0.10, 0.86, 0.74);
  vec3 glow = vec3(0.45, 1.00, 0.92);
  vec3 deep = vec3(0.02, 0.10, 0.18);

  vec3 col = vec3(0.0);
  col += cyan * density * 1.8;
  col += deep * clouds * (1.0 - arms) * 0.45;
  col += glow * core;

  // A scattering of distant stars in the dark.
  float stars = pow(noise(uv * 90.0 + 7.0), 30.0) * smoothstep(0.3, 1.2, r);
  col += vec3(0.7, 0.95, 1.0) * stars * 0.8;

  // Vignette so edges fall to black and blend with page scrims.
  col *= smoothstep(1.55, 0.25, r);

  gl_FragColor = vec4(col, 1.0);
}
`;

const IDLE_MS = 700;
const BREATHE_PERIOD_MS = 4000;
const BREATHE_AMPLITUDE = 0.012; // ± scroll-progress units
const LERP = 0.07; // scroll easing per tick

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const scrollRef = useRef(0); // eased scroll progress
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const breatheBaseRef = useRef(0);
  const breathingRef = useRef(false);
  const breatheStartRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", { alpha: false, antialias: true }) ||
      canvas.getContext("experimental-webgl", {
        alpha: false,
      })) as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL unavailable — ShaderBackground disabled.");
      return;
    }

    // If the GPU context drops (driver reset, tab backgrounded), stop the loop
    // instead of spamming draw calls against a dead context.
    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(rafRef.current);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    // Honor reduced-motion: freeze the autonomous clock + breathing. The swirl
    // still follows scroll (user-initiated), just without ambient animation.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle pair.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();
    const start = performance.now();

    const tick = (now: number) => {
      // Detect scrolling.
      const sy = window.scrollY;
      if (Math.abs(sy - lastScrollYRef.current) > 0.5) {
        lastScrollYRef.current = sy;
        lastScrollTimeRef.current = now;
        breathingRef.current = false;
      }

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const p = Math.min(1, Math.max(0, sy / maxScroll));

      const idle = now - lastScrollTimeRef.current > IDLE_MS;
      let target = p;
      if (idle && !reduceMotion) {
        if (!breathingRef.current) {
          breathingRef.current = true;
          breatheBaseRef.current = scrollRef.current;
          breatheStartRef.current = now;
        }
        const phase =
          ((now - breatheStartRef.current) / BREATHE_PERIOD_MS) * Math.PI * 2;
        target = breatheBaseRef.current + Math.sin(phase) * BREATHE_AMPLITUDE;
      }

      scrollRef.current += (target - scrollRef.current) * LERP;
      const scroll = Math.min(1, Math.max(0, scrollRef.current));

      gl.uniform1f(uTime, reduceMotion ? 0 : (now - start) / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
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
        // Falls back to black if WebGL is unavailable (matches the page bg).
        backgroundColor: "#000000",
      }}
    />
  );
}
