import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  originalOpacity: number;
  wobbleSpeed: number;
  wobbleValue: number;
}

export const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const numParticles = 40; // Kept low and sparse for elegant high-fidelity understatement

    const handleResize = () => {
      const container = canvas.parentElement;
      canvas.width = (container?.clientWidth || window.innerWidth) * window.devicePixelRatio;
      canvas.height = (container?.clientHeight || window.innerHeight) * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 1.5 + 0.5; // Very tiny dust specks
      const opacity = Math.random() * 0.18 + 0.04; // Extremely subtle
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size,
        speedX: (Math.random() - 0.5) * 0.08, // Slow, near-static horizontal drift
        speedY: -(Math.random() * 0.15 + 0.05), // Quietly floating upwards
        opacity,
        originalOpacity: opacity,
        wobbleSpeed: Math.random() * 0.01 + 0.002,
        wobbleValue: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      particles.forEach((p) => {
        // Update position
        p.y += p.speedY;
        p.wobbleValue += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobbleValue) * 0.06; // Elegant sway

        // Boundary wrap loops
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        // Render soft dust particles with a radial blur look
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (1 + Math.sin(p.wobbleValue) * 0.35)})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
    />
  );
};
