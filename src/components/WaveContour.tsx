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

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || window.innerWidth) * window.devicePixelRatio;
      canvas.height = (rect?.height || window.innerHeight) * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Center the graphic in the canvas area, slightly shifted to match the screenshot
      const centerX = width * 0.55;
      const centerY = height * 0.5;

      // Draw 14 concentric contour rings
      const numRings = 15;
      const step = 15; // spacing between rings

      time += 0.008; // slow, majestic frequency drift

      for (let i = 0; i < numRings; i++) {
        // base radius for this ring
        const baseRadius = 110 + i * step;

        ctx.beginPath();
        const numSegments = 180;
        
        for (let j = 0; j <= numSegments; j++) {
          const angle = (j / numSegments) * Math.PI * 2;
          
          // Generative multi-harmonic wobble mimicking the exact fluid curves in the screenshot
          const wobble1 = Math.sin(angle * 3.2 - time + i * 0.12) * 22;
          const wobble2 = Math.cos(angle * 4.8 + time * 1.5 - i * 0.08) * 14;
          const wobble3 = Math.sin(angle * 1.8 + time * 0.5) * 18;
          
          // Anisotropic stretching to give it that organic tilted oval topograhical look
          const stretchX = 1 + Math.sin(angle) * 0.15;
          
          // Combined radius pertubations
          const r = baseRadius + (wobble1 + wobble2 + wobble3) * (0.35 + 0.65 * (i / numRings));
          
          // Convert polar to cartesian coordinates with optional custom squeeze
          const x = centerX + Math.cos(angle) * r * stretchX * 1.1;
          const y = centerY + Math.sin(angle) * r * 0.95;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            // Smooth natural curves using line segments
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        // High-fidelity aesthetic: Outer rings are dimmer and softer
        const opacityRatio = 1 - (i / numRings) * 0.55;
        const alpha = 0.25 * opacityRatio;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = i === 0 ? 1.5 : 1.0;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-85 select-none pointer-events-none"
    />
  );
};
