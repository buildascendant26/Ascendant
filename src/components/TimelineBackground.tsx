import React, { useEffect, useRef } from 'react';

interface TimelineBackgroundProps {
  activeDay: '17' | '18';
}

export const TimelineBackground: React.FC<TimelineBackgroundProps> = ({ activeDay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const warpEnergyRef = useRef<number>(1.0);
  const targetWarpEnergyRef = useRef<number>(1.0);
  const activeDayRef = useRef(activeDay);

  // Trigger warp animation on activeDay change
  useEffect(() => {
    activeDayRef.current = activeDay;
    warpEnergyRef.current = 5.0;
    targetWarpEnergyRef.current = 1.0;
  }, [activeDay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let isVisible = true;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 800;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Use IntersectionObserver to pause animation when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    // Fewer particles — 16 instead of 28
    const particlesCount = 16;
    const particles = Array.from({ length: particlesCount }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.15 + Math.random() * 0.3,
      size: 0.8 + Math.random() * 1.5,
      frequency: 0.001 + Math.random() * 0.002,
      amplitude: 15 + Math.random() * 40,
    }));

    const render = () => {
      if (!ctx || !canvas) return;

      // Skip rendering when off-screen
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }
      
      const width = canvas.width;
      const height = canvas.height;
      const day = activeDayRef.current;
      ctx.clearRect(0, 0, width, height);

      warpEnergyRef.current += (targetWarpEnergyRef.current - warpEnergyRef.current) * 0.035;
      time += 0.4 * warpEnergyRef.current;

      // Draw horizontal grid lines — reduced from 14 to 8
      const gridLines = 8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= gridLines; i++) {
        const y = (height / gridLines) * i + Math.sin(time * 0.01 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Orbital circles — reduced from 4 to 2
      const centerX = width * 0.15;
      const centerY = height * 0.5;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1.5;
      const sinOff = Math.sin(time * 0.005) * 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200 + sinOff, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 450 + sinOff, 0, Math.PI * 2);
      ctx.stroke();

      // Timeline axis
      const xAxis = width - 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xAxis, 0);
      ctx.lineTo(xAxis, height);
      ctx.stroke();

      // Ticks — increased spacing from 35→60 for fewer ticks
      const tickSpacing = 60;
      const totalTicks = Math.ceil(height / tickSpacing);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '8px "JetBrains Mono", monospace';
      
      for (let j = 0; j < totalTicks; j++) {
        const y = (j * tickSpacing + time) % height;
        
        const isMajor = j % 5 === 0;
        const tickLength = isMajor ? 12 : 5;
        ctx.beginPath();
        ctx.moveTo(xAxis, y);
        ctx.lineTo(xAxis - tickLength, y);
        ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)';
        ctx.stroke();

        if (isMajor) {
          ctx.fillText(`T_${(y / 100).toFixed(2)}`, xAxis - 52, y + 3);
        }
      }

      // Sine wave — reduced points from 100→50
      ctx.beginPath();
      ctx.strokeStyle = day === '17' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      
      const wavePointsCount = 50;
      for (let x = 0; x < wavePointsCount; x++) {
        const xPos = (width / wavePointsCount) * x;
        const sineMultiplier = day === '17' ? 1.0 : 1.6;
        const yPos = (height * 0.5) + Math.sin(x * 0.15 + (time * 0.01)) * 30 * sineMultiplier * Math.cos(x * 0.015);
        if (x === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();

      // Flowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const directionMultiplier = day === '17' ? 1 : -1;
        p.y += p.speed * 0.001 * warpEnergyRef.current * directionMultiplier;
        
        if (p.y > 1) p.y = 0;
        if (p.y < 0) p.y = 1;

        const pX = p.x * width + Math.sin(time * p.frequency) * p.amplitude;
        const pY = p.y * height;

        ctx.fillStyle = day === '17' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.arc(pX, pY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[radial-gradient(circle_at_40%_50%,rgba(20,20,20,0.1)_0%,rgba(0,0,0,0.8)_85%)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
