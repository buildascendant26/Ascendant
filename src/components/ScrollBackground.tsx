import { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven image-sequence background.
 *
 * Preloads 192 frames, paints them onto a fullscreen fixed canvas behind all
 * content, and maps scroll position (0 -> max scroll) onto frames 1..192. The
 * frame index is lerped every rAF tick so fast scrolling stays fluid instead of
 * jumping. After 800ms of no scrolling it "breathes" — a slow ±3 frame sine
 * oscillation — and snaps back to scroll-driven playback the moment you scroll.
 *
 * All hot-path state lives in refs to avoid re-renders; the only React state is
 * the one-time loading flag.
 */

const FRAME_COUNT = 192;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

const IDLE_MS = 800; // stop scrolling this long -> start breathing
const BREATHE_PERIOD_MS = 3000; // ~3s per breath
const BREATHE_AMPLITUDE = 3; // ±3 frames
const LERP = 0.15; // frame-index easing per tick
const SOURCE_W = 1280;
const SOURCE_H = 720;

export default function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0); // lerped, fractional frame index
  const scrollTargetRef = useRef(0); // frame index implied by scroll
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Breathing bookkeeping.
  const breathingRef = useRef(false);
  const breatheBaseRef = useRef(0);
  const breatheStartRef = useRef(0);

  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // --- Preload + decode every frame before we start rendering --------------
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const loadOne = (idx: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        const finish = () => {
          images[idx] = img;
          done += 1;
          if (!cancelled) setProgress(Math.round((done / FRAME_COUNT) * 100));
          resolve();
        };
        img.src = FRAME_PATH(idx + 1);
        // Decode off the main paint path; fall back to load/error events.
        img
          .decode()
          .then(finish)
          .catch(() => {
            img.onload = finish;
            img.onerror = finish;
          });
      });

    Promise.all(Array.from({ length: FRAME_COUNT }, (_, i) => loadOne(i))).then(
      () => {
        if (cancelled) return;
        imagesRef.current = images;
        setLoaded(true);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Render loop (only after frames are ready) ---------------------------
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let viewW = 0;
    let viewH = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // object-fit: cover — center-crop the 1280x720 frame to fill the viewport.
    const drawCover = (img: HTMLImageElement) => {
      const scale = Math.max(viewW / SOURCE_W, viewH / SOURCE_H);
      const dw = SOURCE_W * scale;
      const dh = SOURCE_H * scale;
      const dx = (viewW - dw) / 2;
      const dy = (viewH - dh) / 2;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    lastScrollYRef.current = window.scrollY;
    lastScrollTimeRef.current = performance.now();

    const tick = (now: number) => {
      // Detect scrolling by watching scrollY change.
      const sy = window.scrollY;
      if (Math.abs(sy - lastScrollYRef.current) > 0.5) {
        lastScrollYRef.current = sy;
        lastScrollTimeRef.current = now;
        breathingRef.current = false; // scrolling cancels breathing immediately
      }

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const p = Math.min(1, Math.max(0, sy / maxScroll));
      scrollTargetRef.current = p * (FRAME_COUNT - 1);

      const idle = now - lastScrollTimeRef.current > IDLE_MS;

      let target: number;
      if (idle) {
        // Begin breathing around the frame we settled on.
        if (!breathingRef.current) {
          breathingRef.current = true;
          breatheBaseRef.current = currentFrameRef.current;
          breatheStartRef.current = now;
        }
        const phase =
          ((now - breatheStartRef.current) / BREATHE_PERIOD_MS) * Math.PI * 2;
        target = breatheBaseRef.current + Math.sin(phase) * BREATHE_AMPLITUDE;
      } else {
        target = scrollTargetRef.current;
      }

      // Ease the fractional frame index toward the target — no hard jumps.
      currentFrameRef.current += (target - currentFrameRef.current) * LERP;
      const clamped = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, currentFrameRef.current)
      );

      const img = imagesRef.current[Math.round(clamped)];
      if (img) drawCover(img);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [loaded]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          // z-index 0 (not -1): a negative z-index renders BEHIND the opaque
          // <body> background and gets hidden. 0 keeps it behind all real
          // content (which is z-14+) while staying visible over the body.
          zIndex: 0,
          pointerEvents: "none",
          display: "block",
        }}
      />
      {!loaded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            color: "#16c794",
            fontFamily: "monospace",
            fontSize: "14px",
            letterSpacing: "0.25em",
          }}
        >
          LOADING ASSETS... {progress}%
        </div>
      )}
    </>
  );
}
