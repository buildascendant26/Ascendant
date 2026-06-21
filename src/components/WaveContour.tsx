import React, { useEffect, useRef } from 'react';

export const WaveContour: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let cssWidth = 0;
    let cssHeight = 0;

    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      cssWidth = rect?.width ?? window.innerWidth;
      cssHeight = rect?.height ?? window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const cx = cssWidth * 0.5;
      const cy = cssHeight * 0.5;

      const minDim = Math.min(cssWidth, cssHeight);
      const maxRadius = minDim * 0.46;
      const numRings = 14;
      const ringStep = maxRadius / numRings;
      const wobbleAmp = minDim * 0.04;

      time += 0.007;

      // Reduced segments from 200→80 — rings look identical at this scale
      const segments = 80;

      for (let i = 0; i < numRings; i++) {
        const baseR = ringStep * (i + 1);
        ctx.beginPath();

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;

          const w1 = Math.sin(angle * 3.2 - time + i * 0.13) * wobbleAmp;
          const w2 = Math.cos(angle * 4.7 + time * 1.4 - i * 0.09) * wobbleAmp * 0.6;
          const w3 = Math.sin(angle * 1.9 + time * 0.6) * wobbleAmp * 0.75;

          const stretch = 1 + Math.sin(angle) * 0.12;
          const r = baseR + (w1 + w2 + w3) * (0.3 + 0.7 * (i / numRings));

          const x = cx + Math.cos(angle) * r * stretch;
          const y = cy + Math.sin(angle) * r * 0.92;

          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.closePath();

        const fade = 1 - (i / numRings) * 0.5;
        ctx.strokeStyle = `rgba(80, 80, 80, ${0.5 * fade})`;
        ctx.lineWidth = i < 3 ? 0.9 : 0.7;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setSize();
    };

    window.addEventListener('resize', handleResize);
    setSize();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full select-none pointer-events-none"
    />
  );
};
