import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rotation = useRef(0);
  const requestRef = useRef<number | null>(null);
  const isHoveringInteractiveRef = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isHoveringInteractiveRef.current = isHoveringInteractive;
    if (scaleRef.current) {
      scaleRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${isHoveringInteractive ? 1.5 : 1})`;
    }
  }, [isHoveringInteractive]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;

      const normX = ((e.clientX / window.innerWidth) * 100).toFixed(1);
      const normY = ((e.clientY / window.innerHeight) * 100).toFixed(1);
      if (coordsRef.current) {
        coordsRef.current.textContent = `${normX}°W / ${normY}°N`;
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

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

    const animate = () => {
      currentX.current = targetX.current;
      currentY.current = targetY.current;

      rotation.current += isHoveringInteractiveRef.current ? 1.5 : 0.4;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;
      }
      if (rotateRef.current) {
        rotateRef.current.style.transform = `rotate(${rotation.current}deg)`;
      }

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
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      <div
        ref={scaleRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: 'translate3d(-50%, -50%, 0) scale(1)' }}
      >
        <div
          ref={rotateRef}
          className="flex items-center justify-center"
        >
          <div
            className={`absolute rounded-full border border-white/40 transition-all duration-500 origin-center ${
              isHoveringInteractive ? 'w-10 h-5 rotate-[35deg] opacity-100' : 'w-0 h-0 opacity-0'
            }`}
          />

          <div className="absolute w-[2px] h-3 bg-white" />
          <div className="absolute h-[2px] w-3 bg-white" />

          <div className="absolute w-1.5 h-1.5 bg-black rounded-full border border-white/80" />
        </div>
      </div>

      <div
        ref={coordsRef}
        className={`absolute font-mono text-[8px] text-neutral-400 tracking-wider whitespace-nowrap bg-black/40 px-1.5 py-0.5 rounded border border-neutral-900/30 transition-all duration-300 ${
          isHoveringInteractive
            ? 'translate-x-6 -translate-y-6 opacity-30 scale-75'
            : 'translate-x-4 translate-y-2 opacity-80'
        }`}
      >
        00.0°W / 00.0°N
      </div>
    </div>
  );
};
