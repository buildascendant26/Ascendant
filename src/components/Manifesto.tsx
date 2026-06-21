/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Trophy, ArrowRight, ShieldCheck, Flag, Blocks, Mic2 } from 'lucide-react';

interface HackathonPhase {
  id: number;
  phaseNum: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  focusKeywords: string[];
  systemSpecs: {
    label: string;
    value: string;
  }[];
  detailedClues: string[];
}

export const Manifesto: React.FC = () => {
  const [activePhaseId, setActivePhaseId] = useState<number>(1);

  const phases: HackathonPhase[] = [
    {
      id: 1,
      phaseNum: "Day I",
      title: "Capture the Flag",
      subtitle: "Uncover & Decrypt",
      description: "Solve technical challenges, find hidden ciphers, and capture flags. Completing this stage reveals the final build statement.",
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      duration: "10:00 AM - 1:00 PM",
      focusKeywords: ["Reverse Engineering", "File Cryptography", "Logical Decryption"],
      systemSpecs: [
        { label: "Execution Mode", value: "Offline Sandbox" },
        { label: "Target System", value: "Conclave Servers" },
        { label: "Flag Format", value: "ASCENDANT{flag_value}" },
        { label: "Unlock Condition", value: "Extract core keys" }
      ],
      detailedClues: [
        "Hidden challenges hosted on the local sandbox network.",
        "Secure access through workstations mapped inside the atrium.",
        "Analytical puzzles requiring basic logic parsing and cipher keys."
      ]
    },
    {
      id: 2,
      phaseNum: "Day I",
      title: "Open Build",
      subtitle: "Design & Compile",
      description: "Teams architecture and develop their core projects, utilizing any safe frameworks and tools to build out custom interfaces.",
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      duration: "2:00 PM - 5:30 PM",
      focusKeywords: ["React Prototyping", "UI Organization", "Frontend Frameworks"],
      systemSpecs: [
        { label: "Tech Stack", value: "Absolute Autonomy" },
        { label: "Code Focus", value: "Clean state & layout" },
        { label: "Visual Style", value: "Direct, human-centered" },
        { label: "Local Persistence", value: "Client Storage" }
      ],
      detailedClues: [
        "Unrestricted access to standard NPM libraries and layouts.",
        "Mentoring support available on-site and in standard channels.",
        "Focus on polished interface states and direct usable features."
      ]
    },
    {
      id: 3,
      phaseNum: "Day II",
      title: "The Pitch",
      subtitle: "Demonstrate & Present",
      description: "Present completed applications live to our panel of judges, demonstrating structural code quality and visual alignment.",
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      duration: "10:00 AM - 5:00 PM",
      focusKeywords: ["Live Demo", "User Flow Highlights", "Functional Review"],
      systemSpecs: [
        { label: "Presentation", value: "Live Screen Feed" },
        { label: "Q&A Window", value: "3 minutes with Judges" },
        { label: "Scoring Weight", value: "40% Design / 60% Functionality" },
        { label: "Sync Status", value: "Live Node Verification" }
      ],
      detailedClues: [
        "Present live builds directly from sandboxed staging URLs.",
        "Validate operational components under standard test scenarios.",
        "Answer targeted codebase implementation and design questions."
      ]
    }
  ];

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <section id="vision" className="min-h-screen py-24 md:py-36 px-6 md:px-16 w-full flex flex-col justify-center relative border-b border-neutral-900 bg-black overflow-hidden">
      {/* Background radial soft light to build an immense luxurious depth */}
      <div className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] rounded-full bg-neutral-900/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-neutral-900/30 blur-[150px] pointer-events-none" />

      {/* Cybernetic Grid Overlay for technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-18 space-y-4 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse-slow" />
            01 / MISSION PHASES
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Conclave Phases
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light">
            Ascendant is structured across three key stages. Focus on coding challenges, open-ended software prototyping, and clean live presentations.
          </p>
        </div>

        {/* Phase Layout Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Interactive Selector Timeline (Grid span 5) */}
          <div className="lg:col-span-5 space-y-4">
            {phases.map((phase) => {
              const isActive = phase.id === activePhaseId;
              return (
                <div
                  key={phase.id}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={`group relative p-6 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ease-out flex items-start gap-5 ${
                    isActive 
                      ? 'bg-neutral-950 border-neutral-600 shadow-[0_10px_30px_rgba(255,255,255,0.02)]' 
                      : 'bg-neutral-950/20 border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  {/* Selector indicator tab */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white h-full' 
                      : 'bg-transparent h-0 group-hover:h-1/2 group-hover:bg-neutral-800'
                  }`} />

                  {/* Active Indicator Pulse Ring in icon */}
                  <div className={`p-3 rounded-xl border transition-all duration-200 shrink-0 ${
                    isActive 
                      ? 'bg-neutral-900 border-neutral-700' 
                      : 'bg-neutral-950 border-neutral-900 group-hover:border-neutral-800'
                  }`}>
                    {phase.icon}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-500 tracking-wider font-semibold uppercase">
                        {phase.phaseNum}
                      </span>
                      {isActive && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-mono font-medium bg-white/10 text-white tracking-widest uppercase animate-pulse">
                          Active State
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-lg md:text-xl font-bold text-white tracking-tight">
                        {phase.title}
                      </h4>
                      <ArrowRight className={`w-4 h-4 text-neutral-600 transition-all duration-300 ${
                        isActive ? 'text-white translate-x-1' : 'group-hover:text-neutral-400 group-hover:translate-x-0.5'
                      }`} />
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light line-clamp-2">
                      {phase.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Quick specifications legend footer */}
            <div className="pt-6 px-4 flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-900">
              <span>SYNC LATENCY: 0.1ms</span>
              <span>•</span>
              <span>NETWORK BOUNDARY: ELITE DOME INTERNAL</span>
            </div>
          </div>

          {/* Right Side: High-Detail Immersive Display Screen (Grid span 7) */}
          <div className="lg:col-span-7 h-full">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activePhase.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Glass Sheen Reflection */}
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-8 relative z-10">
                  {/* Active Heading Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
                    <div className="space-y-1">
                      <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase font-bold">
                        {activePhase.phaseNum} • OPERATIONAL MODULE
                      </p>
                      <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                        {activePhase.title}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 italic">
                        {activePhase.subtitle}
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-neutral-900 rounded-xl border border-neutral-800 text-right shrink-0">
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">Duration Window</p>
                      <p className="text-xs font-mono font-bold text-white">{activePhase.duration}</p>
                    </div>
                  </div>

                  {/* Core Description block with clean style */}
                  <div className="space-y-3">
                    <h5 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Objective Definition</h5>
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                      {activePhase.description}
                    </p>
                  </div>

                  {/* Operational Tags / Focus */}
                  <div className="space-y-3">
                    <h5 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Cognitive Focus Parameters</h5>
                    <div className="flex flex-wrap gap-2">
                      {activePhase.focusKeywords.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-900 border border-neutral-800/80 text-neutral-200 hover:border-neutral-500 transition-colors duration-300"
                        >
                          #{tag.toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sub-features / Spec list */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    {activePhase.systemSpecs.map((spec) => (
                      <div key={spec.label} className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-900 min-w-0">
                        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider truncate">{spec.label}</p>
                        <p className="text-[10px] sm:text-xs font-mono font-semibold text-white mt-1 break-all line-clamp-2">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Technical protocols / clues */}
                  <div className="space-y-3 pt-2">
                    <h5 className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Transmission Protocol Guidelines</h5>
                    <ul className="space-y-2">
                      {activePhase.detailedClues.map((clue, index) => (
                        <li key={index} className="flex items-start gap-3 text-xs text-neutral-400 font-light leading-relaxed">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Secure Handshake Seal footer */}
                <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-neutral-500 relative z-10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-400" />
                    <span>AUTHENTIC SHA256 ENCRYPTED TRANSACTION PROTOCOLS REGISTERED</span>
                  </div>
                  <span className="bg-neutral-900 px-2 py-0.5 rounded text-neutral-400">REV. 2026.1.18</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
