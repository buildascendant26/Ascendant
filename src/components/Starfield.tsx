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
      // Normalize mouse positions to range [-1, 1]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current.targetPixelX = e.clientX;
      mouseRef.current.targetPixelY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Seed stars/dots
    const stars: Star[] = [];
    const starCount = Math.min(120, Math.floor((width * height) / 12000));
    
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
      // Clear with dark transparent black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Damp mouse coordinates for parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 1;

      // Damp mouse coordinates for pixel coordinates (smooth cursor follow)
      if (mouseRef.current.targetPixelX !== -1000) {
        if (mouseRef.current.pixelX === 0 && mouseRef.current.pixelY === 0) {
          mouseRef.current.pixelX = mouseRef.current.targetPixelX;
          mouseRef.current.pixelY = mouseRef.current.targetPixelY;
        } else {
          mouseRef.current.pixelX += (mouseRef.current.targetPixelX - mouseRef.current.pixelX) * 1;
          mouseRef.current.pixelY += (mouseRef.current.targetPixelY - mouseRef.current.pixelY) * 1;
        }

        // Draw soft, subtle custom light spotlight under/around the dots
        const glowGrd = ctx.createRadialGradient(
          mouseRef.current.pixelX,
          mouseRef.current.pixelY,
          0,
          mouseRef.current.pixelX,
          mouseRef.current.pixelY,
          150
        );
        glowGrd.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
        glowGrd.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
        glowGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glowGrd;
        ctx.beginPath();
        ctx.arc(mouseRef.current.pixelX, mouseRef.current.pixelY, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render stars/dots with interactive offset
      stars.forEach((star) => {
        // Twinkle calculations
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }

        // Apply mouse inertia for depth parallax
        const offsetX = -mouseRef.current.x * star.size * 15;
        const offsetY = -mouseRef.current.y * star.size * 15;

        // Apply subtle ambient continuous drift
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap stars around screen boundaries
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const starSX = star.x + offsetX;
        const starSY = star.y + offsetY;
        const alphaVal = Math.max(0.1, Math.min(1, star.baseAlpha * Math.abs(star.alpha)));

        let finalAlpha = alphaVal;
        let finalSize = star.size;
        let glowStrength = 0;

        // Calculate cursor distance for custom dot glow interaction
        if (mouseRef.current.targetPixelX !== -1000) {
          const dx = starSX - mouseRef.current.pixelX;
          const dy = starSY - mouseRef.current.pixelY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxGlowDistance = 140; // Glow radius in pixels
          if (distance < maxGlowDistance) {
            glowStrength = (1 - distance / maxGlowDistance); // 0 at edge, 1 at center
            finalAlpha = Math.min(1.0, alphaVal + glowStrength * 0.82);
            finalSize = star.size * (1 + glowStrength * 0.8);
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        if (glowStrength > 0) {
          ctx.shadowBlur = (star.size > 1.2 ? 4 : 0) + glowStrength * 12;
          ctx.shadowColor = `rgba(255, 255, 255, ${0.4 + glowStrength * 0.6})`;
        } else {
          ctx.shadowBlur = star.size > 1.2 ? 4 : 0;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        }

        ctx.beginPath();
        ctx.arc(starSX, starSY, finalSize, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0; // Reset shadow for next calls
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
