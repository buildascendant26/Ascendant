/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  speed: number;
  driftX: number;
  driftY: number;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    pixelX: 0,
    pixelY: 0,
    targetPixelX: -1000,
    targetPixelY: -1000
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetPixelX = e.clientX;
      mouseRef.current.targetPixelY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Reduced star count — cap at 80 instead of 120
    const stars: Star[] = [];
    const starCount = Math.min(80, Math.floor((width * height) / 18000));
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.3,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.015,
        driftX: (Math.random() - 0.5) * 0.1,
        driftY: (Math.random() - 0.5) * 0.1,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse for parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Lerp pixel mouse for glow
      if (mouseRef.current.targetPixelX !== -1000) {
        if (mouseRef.current.pixelX === 0 && mouseRef.current.pixelY === 0) {
          mouseRef.current.pixelX = mouseRef.current.targetPixelX;
          mouseRef.current.pixelY = mouseRef.current.targetPixelY;
        } else {
          mouseRef.current.pixelX += (mouseRef.current.targetPixelX - mouseRef.current.pixelX) * 0.15;
          mouseRef.current.pixelY += (mouseRef.current.targetPixelY - mouseRef.current.pixelY) * 0.15;
        }
      }

      const mPx = mouseRef.current.pixelX;
      const mPy = mouseRef.current.pixelY;
      const hasMouse = mouseRef.current.targetPixelX !== -1000;

      // Render stars — NO shadowBlur (the single biggest perf killer)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }

        // Mouse parallax offset
        const offsetX = -mouseRef.current.x * star.size * 15;
        const offsetY = -mouseRef.current.y * star.size * 15;

        // Ambient drift
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const sx = star.x + offsetX;
        const sy = star.y + offsetY;
        let alphaVal = Math.max(0.1, Math.min(1, star.baseAlpha * Math.abs(star.alpha)));
        let size = star.size;

        // Cursor proximity glow (lightweight — no shadowBlur)
        if (hasMouse) {
          const dx = sx - mPx;
          const dy = sy - mPy;
          const distSq = dx * dx + dy * dy;
          const maxDist = 140;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / maxDist;
            alphaVal = Math.min(1.0, alphaVal + factor * 0.6);
            size = star.size * (1 + factor * 0.5);
          }
        }

        ctx.fillStyle = `rgba(255,255,255,${alphaVal})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="starfield-canvas"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 bg-black"
    />
  );
};
