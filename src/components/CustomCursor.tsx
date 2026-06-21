/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coordsText, setCoordsText] = useState({ x: '00.0', y: '00.0' });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rotation = useRef(0);
  const requestRef = useRef<number | null>(null);
  const isHoveringInteractiveRef = useRef(false);

  // Sync ref with state for the animation loop
  useEffect(() => {
    isHoveringInteractiveRef.current = isHoveringInteractive;
  }, [isHoveringInteractive]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      
      // Update normalized decimal coordinate display format for a futuristic feel
      const normX = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const normY = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      setCoordsText({ x: normX, y: normY });
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Listen for hover on clickable class/tag targets immediately and accurately
    const checkInteractivity = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'INPUT' || 
        target.closest('button') !== null || 
        target.closest('a') !== null || 
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer') ||
        (target.style && target.style.cursor === 'pointer');

      setIsHoveringInteractive(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', checkInteractivity);
    window.addEventListener('mouseover', checkInteractivity);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Dynamic rotation and smooth interpolation (lerping) loop
    const animate = () => {
      // Lerp custom position for smooth interactive lag
      currentX.current += (targetX.current - currentX.current) * 1;
      currentY.current += (targetY.current - currentY.current) * 1;
      
      // Infinite continuous rotation speed adapts when hovering
      rotation.current += isHoveringInteractiveRef.current ? 1.5 : 0.4;
      
      setPosition({ x: currentX.current, y: currentY.current });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', checkInteractivity);
      window.removeEventListener('mouseover', checkInteractivity);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      id="custom-sensor-cursor"
      className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {/* Scale Transition Wrapper (Separated from JS rotation to prevent CSS/JS transform updates clash) */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(-50%, -50%, 0) scale(${isHoveringInteractive ? 1.5 : 1})`,
        }}
      >
        {/* Rotation core wrapper - purely handled via requestAnimationFrame updates */}
        <div 
          className="flex items-center justify-center"
          style={{
            transform: `rotate(${rotation.current}deg)`,
          }}
        >
          {/* Tilted orbital ring visible on hover */}
          <div 
            className={`absolute rounded-full border border-white/40 transition-all duration-500 origin-center ${
              isHoveringInteractive ? 'w-10 h-5 rotate-[35deg] opacity-100' : 'w-0 h-0 opacity-0'
            }`}
          />

          {/* Vertical/Horizontal target lines */}
          <div className="absolute w-[2px] h-3 bg-white" />
          <div className="absolute h-[2px] w-3 bg-white" />

          {/* Hollow center core */}
          <div className="absolute w-1.5 h-1.5 bg-black rounded-full border border-white/80" />
        </div>
      </div>

      {/* Floating Coordinate Telemetry Tag */}
      <div 
        className={`absolute font-mono text-[8px] text-neutral-400 tracking-wider whitespace-nowrap bg-black/40 px-1.5 py-0.5 rounded border border-neutral-900/30 transition-all duration-300 ${
          isHoveringInteractive ? 'translate-x-6 -translate-y-6 opacity-30 scale-75' : 'translate-x-4 translate-y-2 opacity-80'
        }`}
      >
        {coordsText.x}°W / {coordsText.y}°N
      </div>
    </div>
  );
};
