import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AscendantSymbol } from './AscendantSymbol';

interface InteractiveFooterProps {
  onSmoothScroll: (targetId: string) => void;
}

export const InteractiveFooter: React.FC<InteractiveFooterProps> = ({ onSmoothScroll }) => {
  const [timeStr, setTimeStr] = useState('');

  // Clean real-time UTC ticking clock for real-world authenticity
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.toUTCString().replace('GMT', 'UTC');
      setTimeStr(utc);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="support" className="relative z-30 bg-black/50 pt-24 pb-12 px-6 md:px-12 w-full select-none overflow-hidden text-white">
      
      {/* Bold horizontal top border for a strong structural presence */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-100" />

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-12 text-center">
        
        {/* Hero Branding with raw visual power and contrast */}
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 mt-4">
          <motion.div 
            className="w-12 h-12 text-white fill-white mb-6 relative hover:scale-110 transition-transform duration-300 cursor-pointer"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSmoothScroll('home')}
          >
            <AscendantSymbol />
          </motion.div>
          <h3 className="font-bebas text-white tracking-normal text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[9.5vw] leading-[0.8] uppercase font-bold select-none cursor-default">
            ASCENDANT
          </h3>
          <p className="font-mono text-[9px] sm:text-xs tracking-[0.45em] text-neutral-400 uppercase mt-2">
            Where ideas become reality
          </p>
        </div>

        {/* Sparse yet highly high-contrast 3-column configuration */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 border-t border-neutral-800 pt-10 mt-4 text-[10px] font-mono tracking-widest text-neutral-400">
          
          {/* Column 1: Spatial Location & Coordinates */}
          <div className="flex flex-col md:items-start justify-center gap-1.5 text-center md:text-left">
            <span className="text-white font-bold block uppercase text-[8px] tracking-[0.25em]">SPATIAL ORIGIN</span>
            <span className="text-neutral-300 font-medium">
              34.0522° N, 118.2437° W // LAX
            </span>
          </div>

          {/* Column 2: Contact Information */}
          <div className="flex flex-col items-center justify-center gap-1.5 text-center">
            <span className="text-white font-bold block uppercase text-[8px] tracking-[0.25em]">CONTACT</span>
            <a href="tel:9538944115" className="text-neutral-300 font-medium hover:text-white transition-colors">
              9538944115
            </a>
            <a href="tel:7259327937" className="text-neutral-300 font-medium hover:text-white transition-colors">
              7259327937
            </a>
            <a href="mailto:support@ascendant2026.tech" className="text-neutral-300 font-medium hover:text-white transition-colors">
              support@ascendant2026.tech
            </a>
          </div>

          {/* Column 3: Real-time ticking chronometer */}
          <div className="flex flex-col md:items-end justify-center gap-1.5 text-center md:text-right">
            <span className="text-white font-bold block uppercase text-[8px] tracking-[0.25em]">CURRENT CYCLE</span>
            <span className="text-neutral-300 font-medium whitespace-nowrap">
              {timeStr || 'SYNCHRONIZING...'}
            </span>
          </div>

        </div>

        {/* Absolute minimum footprint trademark declaration */}
        <div className="text-[9px] text-neutral-600 font-mono tracking-[0.15em] pt-4 uppercase cursor-default">
          © 2026 ASCENDANT. ALL INTEGRITY AND AUTONOMY RESERVED.
        </div>

      </div>
    </footer>
  );
};
