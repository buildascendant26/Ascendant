/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Compass, Moon, Orbit, Quote, Home } from 'lucide-react';
import { AscendantSymbol } from './AscendantSymbol';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const md = new Date();
      setUtcTime(md.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { num: '00', label: 'HOME', target: 'home', icon: <Home className="w-4 h-4 text-neutral-400" /> },
    { num: '01', label: 'THE PHASES', target: 'vision', icon: <Compass className="w-4 h-4 text-neutral-400" /> },
    { num: '02', label: 'CHRONOLOGY', target: 'program', icon: <Moon className="w-4 h-4 text-neutral-400" /> },
    { num: '03', label: 'THE ESSENCE', target: 'summit-quote', icon: <Quote className="w-4 h-4 text-neutral-400" /> },
    { num: '04', label: 'SUPPORT', target: 'support', icon: <ArrowRight className="w-4 h-4 text-neutral-400" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-drawer-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-6 md:p-16 text-white bg-dot-grid overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 text-white">
                <AscendantSymbol strokeWidth={1.5} />
              </div>
              <span className="font-display font-bold tracking-widest text-sm text-neutral-200">ASCENDANT</span>
            </div>
            
            <button
              id="menu-close-btn"
              onClick={onClose}
              className="group p-3 border border-neutral-800 rounded-full hover:border-neutral-400 transition-colors duration-300 bg-neutral-950 hover:bg-neutral-900"
            >
              <X className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors duration-300 group-hover:rotate-90 transform" />
            </button>
          </div>

          {/* Links */}
          <nav className="my-auto max-w-xl md:max-w-3xl">
            <p className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase mb-8">Navigation Directory</p>
            <div className="space-y-6 md:space-y-10">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.target}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <button
                    onClick={() => {
                      onNavigate(item.target);
                      onClose();
                    }}
                    className="group flex items-baseline gap-4 md:gap-8 text-left focus:outline-none w-full"
                  >
                    <span className="font-mono text-xs md:text-sm text-neutral-500 group-hover:text-white transition-colors duration-300">
                      {item.num}
                    </span>
                    <div className="relative overflow-hidden flex items-center gap-4">
                      <span className="font-display text-4xl md:text-7xl font-bold tracking-tight text-neutral-300 group-hover:text-white transition-colors duration-300 block">
                        {item.label}
                      </span>
                      {/* Underline */}
                      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-white transition-all duration-300 group-hover:w-full" />
                    </div>
                    <span className="hidden md:flex opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 ml-4">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </nav>

          {/* Footer Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-neutral-900 text-xs text-neutral-500 font-mono">
            <div>
              <p className="text-neutral-400 font-medium uppercase tracking-wider mb-1">Temporal Anchor</p>
              <p className="animate-pulse-slow">{utcTime || '17-18 JULY 2026 UTC'}</p>
            </div>
            <div>
              <p className="text-neutral-400 font-medium uppercase tracking-wider mb-1">Spatial Coordinates</p>
              <p className="text-neutral-300">34.0522° N, 118.2437° W • Elite Dome</p>
            </div>
            <div>
              <p className="text-neutral-400 font-medium uppercase tracking-wider mb-1">Transmission</p>
              <div className="flex flex-col gap-1 mt-1">
                <a href="tel:7259327937" className="hover:text-white transition-colors">7259327937</a>
                <a href="mailto:support@ascendant2026.tech" className="hover:text-white transition-colors">support@ascendant2026.tech</a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
