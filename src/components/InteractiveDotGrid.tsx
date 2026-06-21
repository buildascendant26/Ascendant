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
      // Reset transform fully before applying DPR — prevents scale from compounding on each resize
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

    const gridSize = 30; // Matches background-size of previous bg-dot-grid
    const baseOpacity = 0.06; // Elegant subtle base grid
    const targetRadius = 130;  // Area of influence around cursor

    // Initialize position off-screen
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Instant mouse coordinate tracking (no lag)
      if (mouseRef.current.targetX === -1000) {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      } else {
        mouseRef.current.x = mouseRef.current.targetX;
        mouseRef.current.y = mouseRef.current.targetY;
      }

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      const halfGrid = gridSize / 2;

      // Draw dot grid
      for (let x = halfGrid; x < width; x += gridSize) {
        for (let y = halfGrid; y < height; y += gridSize) {
          let opacity = baseOpacity;
          let dotSize = 0.8; // standard subtle size

          if (mX !== -1000 && mY !== -1000) {
            const dx = x - mX;
            const dy = y - mY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < targetRadius) {
              const factor = 1 - dist / targetRadius; // 0 (edge) -> 1 (center)
              const easeFactor = factor * factor; // easeIn transition for pristine fluid feel
              opacity = baseOpacity + easeFactor * 0.44; // increase brightness smoothly
              dotSize = 0.8 + easeFactor * 1.0; // grow dots smoothly near cursor
            }
          }

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
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
