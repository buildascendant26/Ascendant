import React, { useEffect, useRef, useState } from 'react';

interface TimelineBackgroundProps {
  activeDay: '17' | '18';
}

export const TimelineBackground: React.FC<TimelineBackgroundProps> = ({ activeDay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track kinetic energy of the time-warp transition
  const warpEnergyRef = useRef<number>(1.0);
  const targetWarpEnergyRef = useRef<number>(1.0);

  // Trigger warp animation on activeDay change
  useEffect(() => {
    // Boost warps speed, then slowly decay back to base speed
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

    // Responsive sizing
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 800;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Coordinate state of particle array
    const particlesCount = 28;
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
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Damp the warpEnergy towards target warp energy slowly
      warpEnergyRef.current += (targetWarpEnergyRef.current - warpEnergyRef.current) * 0.035;
      time += 0.4 * warpEnergyRef.current;

      // Draw horizontal dynamic laser grids
      const gridLines = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= gridLines; i++) {
        const y = (height / gridLines) * i + Math.sin(time * 0.01 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw subtle orbital concentric circles corresponding to temporal anchor points
      const centerX = width * 0.15;
      const centerY = height * 0.5;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1.5;
      [120, 250, 420, 600].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + Math.sin(time * 0.005) * 15, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw ticking chronology timeline axis (an architectural ruler on the right margin)
      const xAxis = width - 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xAxis, 0);
      ctx.lineTo(xAxis, height);
      ctx.stroke();

      const tickSpacing = 35;
      const totalTicks = Math.ceil(height / tickSpacing);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = '8px "JetBrains Mono", monospace';
      
      for (let j = 0; j < totalTicks; j++) {
        const y = (j * tickSpacing + time) % height;
        
        ctx.beginPath();
        // Dynamic tick length based on mathematical index remainder
        const isMajor = j % 5 === 0;
        const tickLength = isMajor ? 12 : 5;
        ctx.moveTo(xAxis, y);
        ctx.lineTo(xAxis - tickLength, y);
        ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)';
        ctx.stroke();

        // Print precise coordinate markers alongside major ticker lines
        if (isMajor) {
          ctx.fillText(`T_${(y / 100).toFixed(2)}`, xAxis - 52, y + 3);
        }
      }

      // Render flowing energy coordinates (horizontal sine stream)
      ctx.beginPath();
      ctx.strokeStyle = activeDay === '17' 
        ? 'rgba(255, 255, 255, 0.04)' 
        : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      
      const wavePointsCount = 100;
      for (let x = 0; x < wavePointsCount; x++) {
        const xPos = (width / wavePointsCount) * x;
        const sineMultiplier = activeDay === '17' ? 1.0 : 1.6;
        const yPos = (height * 0.5) + Math.sin(x * 0.15 + (time * 0.01)) * 30 * sineMultiplier * Math.cos(x * 0.015);
        if (x === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();

      // Flowing quantum particles
      particles.forEach((p) => {
        // Move y pos based on activeDay direction and warp energy
        const directionMultiplier = activeDay === '17' ? 1 : -1;
        p.y += p.speed * 0.001 * warpEnergyRef.current * directionMultiplier;
        
        // Wrap around loop bounds perfectly
        if (p.y > 1) p.y = 0;
        if (p.y < 0) p.y = 1;

        const pX = p.x * width + Math.sin(time * p.frequency) * p.amplitude;
        const pY = p.y * height;

        // Faded, hyper-minimal high-contrast dot
        ctx.fillStyle = activeDay === '17' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.arc(pX, pY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles using faint neon bridges if they are in close vertical range
        if (warpEnergyRef.current > 1.2) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.04, 0.01 * warpEnergyRef.current)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pX, pY);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        }
      });

      // Digital matrix-like background identifiers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`SYS.SEQUENCE_ID: ${activeDay === '17' ? '0XDF8097_1' : '0XDF8097_2'}`, 30, height - 30);
      ctx.fillText(`WARP_FACTOR: ${warpEnergyRef.current.toFixed(2)}x`, 30, height - 15);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeDay]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[radial-gradient(circle_at_40%_50%,rgba(20,20,20,0.1)_0%,rgba(0,0,0,0.8)_85%)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
