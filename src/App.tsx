/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MenuDrawer } from "./components/MenuDrawer";
import { Manifesto } from "./components/Manifesto";
import { Timeline } from "./components/Timeline";
import { BoldQuote } from "./components/BoldQuote";
import { VideoLoader } from "./components/VideoLoader";
import { WaveContour } from "./components/WaveContour";
import { FloatingParticles } from "./components/FloatingParticles";
import { InteractiveDotGrid } from "./components/InteractiveDotGrid";
import { InteractiveFooter } from "./components/InteractiveFooter";
import { RegistrationPage } from "./components/RegistrationPage";
import CountdownTimer from "./components/CountdownTimer";
import ascendantLogo from "./components/ascendant_logo.png";
import { MapPin } from "lucide-react";
import ParticleSphereBackground from "./components/ParticleSphereBackground";
import { TerminalGlitchOverlay } from "./components/TerminalGlitchOverlay";
import { AscendantSymbol } from "./components/AscendantSymbol";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  // Ref for direct DOM updates — avoids React re-renders on every scroll tick
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  // Lock scrolling during the interactive calibration loading phase or registration flow shlok is ccool boy
  useEffect(() => {
    if (isLoading || isRegistering) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading, isRegistering]);

  // Fluid scroll progress bar — RAF + direct DOM + GPU-accelerated transform
  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-white selection:text-black font-sans overflow-hidden">
      {/* Persistent particle-sphere background — global layer behind
          everything, scroll-driven dolly + idle breathing. */}
      <ParticleSphereBackground />

      {/* Dynamic interactive video loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="conclave-loader-wrapper"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(16px)", scale: 1.03 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[100] bg-black"
          >
            <VideoLoader onComplete={() => {
              setIsLoading(false);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background is the particle-sphere globe (ParticleSphereBackground). */}

      {/* Dynamic interactive dot grid that responds elegantly to the cursor */}
      <div className="relative z-[14] pointer-events-none">
        {!isLoading && <InteractiveDotGrid />}
      </div>

      {/* DOM overlay text scramble triggered as each depth section enters view */}
      {!isLoading && <TerminalGlitchOverlay />}

      {/* Sleek top screen progressive scroll indicator — scaleX is GPU composited */}
      <div
        ref={progressBarRef}
        id="scroll-progress-indicator"
        className="fixed top-0 left-0 h-[2.5px] bg-white z-40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{ width: '100%', transform: 'scaleX(0)', transformOrigin: 'left center', willChange: 'transform' }}
      />

      {/* Core Redesigned Hero Landing View (Height 100vh - exact screenshot style) */}
      <header
        id="home"
        className="relative w-full min-h-screen min-h-[100dvh] flex flex-col justify-between pt-2 md:pt-4 px-6 md:px-12 pb-6 md:pb-12 z-20"
      >
        {/* Subtle, slowly drifting floating dust particle effect */}
        {!isLoading && <FloatingParticles />}

        {/* Top Header Row — 3-column grid guarantees Ascendant logo stays dead center */}
        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center relative z-30">
            <div className="flex items-start justify-start">
              <div className="flex flex-col items-start justify-center gap-0.5 mt-2 sm:mt-0 -ml-1 sm:ml-0">
                <div className="h-10 sm:h-12 md:h-16 flex items-center justify-start">
                  <img
                    src="/dps_logo.png"
                    alt="Delhi Public School Bangalore East"
                    className="h-full object-contain"
                  />
                </div>
                <p className="font-mono text-[9px] md:text-[10px] text-neutral-400 tracking-[0.25em] uppercase text-left w-full ml-3">
                  presents,
                </p>
              </div>
            </div>

          <div className="flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img
                src={ascendantLogo}
                alt="Ascendant Logo"
                className="w-full h-full object-contain brightness-110 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              id="menu-open-toggle-btn"
              onClick={() => setIsMenuOpen(true)}
              className="group flex flex-col gap-1.5 justify-center items-end p-2 transition-all duration-300 cursor-pointer"
            >
              <span className="w-6 h-[2px] bg-white group-hover:opacity-80 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <span className="w-6 h-[2px] bg-white group-hover:opacity-80 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              <span className="w-6 h-[2px] bg-white group-hover:opacity-80 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </button>
          </div>
        </div>

        {/* Centerpiece Core Grid matching screenshot */}
        <div className="w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative py-2 md:py-6 z-10">
          {/* Left Column for Typographic Hierarchy (Text, Subtitle, CTA) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left order-2 lg:order-1 mt-4 lg:mt-4 relative">
            {/* Date relocated above the Hero Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.05,
              }}
              className="mb-2 md:mb-4"
            >
              <h1
                className="font-sans text-base md:text-xl font-medium tracking-[0.16em] text-white"
                style={{ textIndent: "0.10em" }}
              >
                17–18 JULY 2026
              </h1>
            </motion.div>

            {/* Giant Title "ASCENDANT" with Bebas Neue condensed font */}
            <motion.h2
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={
                !isLoading ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
              }
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="font-bebas text-white tracking-normal leading-[0.85] text-[24vw] sm:text-[20vw] md:text-[16vw] lg:text-[12vw] xl:text-[13.5vw] uppercase select-none w-full font-bold"
              style={{ textIndent: "-0.04em" }}
            >
              ASCENDANT
            </motion.h2>

            {/* Subtitle area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.45,
              }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 md:mt-1"
            >
              <p className="font-mono text-base sm:text-lg md:text-xl lg:text-[1.5rem] text-neutral-200 font-semibold tracking-wide leading-normal">
                Decode. Build. Pitch.
              </p>

              {/* Slanted oval badge containing the Ascendant symbol */}
              <div className="inline-flex items-center justify-center border border-white/30 rounded-full w-12 h-10 bg-neutral-950 -rotate-12 hover:rotate-0 hover:border-white/60 transition-transform duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] shrink-0 self-center p-1.5">
                <AscendantSymbol className="w-full h-full text-white" strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* REGISTER NOW Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={!isLoading ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.65,
              }}
              className="mt-8 md:mt-10"
            >
              <button
                onClick={() => setIsRegistering(true)}
                className="group relative flex items-center justify-center gap-4 pl-5 pr-8 py-3.5 bg-neutral-900/60 border border-white/10 hover:border-white/40 text-white rounded-xl transition-all duration-300 cursor-pointer text-xs md:text-sm font-semibold tracking-[0.25em] uppercase hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <span>REGISTER NOW</span>
                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1.5">
                  ➔
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right Column containing the dynamic topographical wave mesh */}
          <div className="hidden lg:flex lg:col-span-5 w-full h-[35vh] sm:h-[45vh] lg:h-[60vh] items-center justify-center relative order-1 lg:order-2 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              animate={
                !isLoading ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}
              }
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <WaveContour />
            </motion.div>
          </div>
        </div>

        {/* Bottom indicator Row */}
        <div className="w-full flex justify-between items-end relative z-30 pt-4">
          {/* Bottom left telemetries */}
          <div className="hidden md:block font-mono text-[9px] text-neutral-500">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              DELHI PUBLIC SCHOOL BANGALORE EAST
            </p>
            <p className="mt-1">
              <CountdownTimer />
            </p>
          </div>

          {/* Bottom right indicator - removed */}
        </div>
      </header>

      {/* Main content layers */}
      <main className="relative z-30">
        {/* 01: THE MANIFESTO */}
        <Manifesto />

        {/* 02: CHRONOLOGY / EVENT TIMELINE */}
        <Timeline />

        {/* 03: BOLD QUOTE OUTRO */}
        <BoldQuote />
      </main>

      {/* Interactive Cybernetic Telemetry Footer */}
      <InteractiveFooter onSmoothScroll={handleSmoothScroll} />

      {/* Navigation Overlay menu drawer */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleSmoothScroll}
      />

      {/* Terminal registration overlay with smooth entry / exit */}
      <AnimatePresence>
        {isRegistering && (
          <RegistrationPage onClose={() => setIsRegistering(false)} />
        )}
      </AnimatePresence>

      {/* CRT scanline + vignette layer: above visual layers, interaction-safe */}
      <div className="terminal-crt-overlay" aria-hidden="true" />
    </div>
  );
}
