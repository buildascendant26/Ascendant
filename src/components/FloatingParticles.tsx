import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
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
    // Reduced from 40 to 20 — these are tiny dust specks, fewer is still elegant
    const numParticles = 20;
    let cssWidth = 0;
    let cssHeight = 0;

    const handleResize = () => {
      const container = canvas.parentElement;
      cssWidth = container?.clientWidth || window.innerWidth;
      cssHeight = container?.clientHeight || window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.18 + 0.04;
      particles.push({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        size,
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: -(Math.random() * 0.15 + 0.05),
        opacity,
        wobbleSpeed: Math.random() * 0.01 + 0.002,
        wobbleValue: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.wobbleValue += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobbleValue) * 0.06;

        if (p.y < -10) {
          p.y = cssHeight + 10;
          p.x = Math.random() * cssWidth;
        }
        if (p.x < -10) {
          p.x = cssWidth + 10;
        } else if (p.x > cssWidth + 10) {
          p.x = -10;
        }

        const alpha = p.opacity * (1 + Math.sin(p.wobbleValue) * 0.35);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

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
