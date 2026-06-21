import React, { useEffect, useRef } from 'react';

export const InteractiveDotGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const parent = canvas.parentElement || document.body;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    
    handleResize();

    // Increased grid size for fewer dots = much faster rendering
    const gridSize = 40;
    const baseOpacity = 0.06;
    const targetRadius = 130;
    const targetRadiusSq = targetRadius * targetRadius;

    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Snap mouse position (no lerp = no lag, direct tracking)
      if (mouseRef.current.targetX === -1000) {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      } else {
        mouseRef.current.x = mouseRef.current.targetX;
        mouseRef.current.y = mouseRef.current.targetY;
      }

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;
      const hasMouse = mX !== -1000 && mY !== -1000;

      const halfGrid = gridSize / 2;

      // Draw base grid at uniform opacity in a single batch
      ctx.fillStyle = `rgba(255, 255, 255, ${baseOpacity})`;
      for (let x = halfGrid; x < width; x += gridSize) {
        for (let y = halfGrid; y < height; y += gridSize) {
          // Skip dots near cursor — we'll draw them brighter separately
          if (hasMouse) {
            const dx = x - mX;
            const dy = y - mY;
            if (dx * dx + dy * dy < targetRadiusSq) continue;
          }
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw highlighted dots near cursor
      if (hasMouse) {
        for (let x = halfGrid; x < width; x += gridSize) {
          for (let y = halfGrid; y < height; y += gridSize) {
            const dx = x - mX;
            const dy = y - mY;
            const distSq = dx * dx + dy * dy;

            if (distSq < targetRadiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / targetRadius;
              const easeFactor = factor * factor;
              const opacity = baseOpacity + easeFactor * 0.44;
              const dotSize = 0.8 + easeFactor * 1.0;

              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.beginPath();
              ctx.arc(x, y, dotSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-100"
    />
  );
};
