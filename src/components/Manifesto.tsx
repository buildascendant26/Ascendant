/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Cpu, Trophy, ArrowRight, ShieldCheck, Flag, Blocks, Mic2 } from 'lucide-react';
import ScrambleText from './ScrambleText';
import TypewriterText from './TypewriterText';

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
      phaseNum: "Phase 1",
      title: "Capture the Flag (CTF)",
      subtitle: "Uncover & Decrypt",
      description: "A cybersecurity challenge where teams solve puzzles, exploit vulnerabilities, decode clues, and uncover hidden flags.",
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      duration: "10:00 AM - 1:00 PM",
      focusKeywords: ["Problem-solving", "Logical reasoning", "Cybersecurity", "Team collaboration"],
      systemSpecs: [
        { label: "Core Objective", value: "Uncover hidden flags" },
        { label: "Scoring Method", value: "Based on number and difficulty" },
        { label: "Challenge Type", value: "Puzzles and Vulnerabilities" },
        { label: "Environment", value: "Under pressure" }
      ],
      detailedClues: [
        "Test your problem-solving ability in a timed environment.",
        "Apply logical reasoning to decode clues.",
        "Earn points based on the number and difficulty of challenges completed."
      ]
    },
    {
      id: 2,
      phaseNum: "Phase 2",
      title: "Open Build",
      subtitle: "Develop & Create",
      description: "Following the CTF, teams will receive a problem statement and begin developing a solution from scratch.",
      icon: <Cpu className="w-6 h-6 text-purple-400" />,
      duration: "Day 1 2:00 PM - Day 2 10:00 AM",
      focusKeywords: ["Brainstorm ideas", "Design UX", "Build functional prototypes", "Innovative solutions"],
      systemSpecs: [
        { label: "Project Scope", value: "Develop solution from scratch" },
        { label: "Allowed Domains", value: "AI, Web, Cyber, Automation, Social Impact" },
        { label: "Primary Goal", value: "Create meaningful solutions" },
        { label: "Approach", value: "Think boldly" }
      ],
      detailedClues: [
        "Brainstorm ideas and design intuitive user experiences.",
        "Build functional prototypes that address the problem statement.",
        "Develop innovative technology solutions across various domains."
      ]
    },
    {
      id: 3,
      phaseNum: "Phase 3",
      title: "Final Pitch",
      subtitle: "Demonstrate & Present",
      description: "Teams will present their projects before a panel of judges consisting of industry professionals, educators, and technology experts.",
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      duration: "10:00 AM - 5:00 PM",
      focusKeywords: ["Showcase problem", "Present solution", "Technical implementation", "Real-world impact"],
      systemSpecs: [
        { label: "Audience", value: "Industry professionals & experts" },
        { label: "Evaluation Criteria 1", value: "Creativity & Technical excellence" },
        { label: "Evaluation Criteria 2", value: "Usability & Presentation" },
        { label: "Key Focus", value: "Overall impact and scalability" }
      ],
      detailedClues: [
        "Showcase the specific problem your team addressed.",
        "Highlight your solution, innovation, and technical implementation.",
        "Demonstrate the real-world impact and scalability of your project."
      ]
    }
  ];

  const activePhase = phases.find(p => p.id === activePhaseId) || phases[0];

  return (
    <section id="vision" className="min-h-screen py-24 md:py-36 px-6 md:px-16 w-full flex flex-col justify-center relative border-b border-neutral-900 bg-black/50 overflow-hidden">
      {/* Background radial soft light to build an immense luxurious depth */}
      <div className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] rounded-full bg-neutral-900/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-neutral-900/30 blur-[150px] pointer-events-none" />

      {/* Cybernetic Grid Overlay for technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-18 space-y-4 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse-slow" />
            01 / COMPETITION FORMAT
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            A Three-Phase Challenge
          </h2>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed font-light">
            Ascendant 2026 is not just a hackathon—it's a complete test of technical skill, creativity, teamwork, and execution. Participants will progress through three exciting phases, each designed to challenge a different aspect of innovation.
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
                      <span className="font-mono text-xs text-neutral-400 tracking-wider font-semibold uppercase">
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
            <div className="pt-6 px-4 flex items-center justify-center text-[11px] font-mono text-neutral-400 border-t border-neutral-900">
              <TypewriterText text="THIS TOO SHALL PASS" speed={60} />
            </div>
          </div>

          {/* Right Side: High-Detail Immersive Display Screen (Grid span 7) */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
                {/* Visual Glass Sheen Reflection */}
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-8 relative z-10">
                  {/* Active Heading Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
                    <div className="space-y-1">
                      <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase font-bold">
                        <ScrambleText as="span" text={`${activePhase.phaseNum} • OPERATIONAL MODULE`} trigger={activePhaseId} />
                      </p>
                      <h3 className="font-display text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                        <ScrambleText as="span" text={activePhase.title} trigger={activePhaseId} />
                      </h3>
                      <p className="text-xs font-mono text-neutral-400 italic">
                        <ScrambleText as="span" text={activePhase.subtitle} trigger={activePhaseId} />
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-neutral-900 rounded-xl border border-neutral-800 text-right shrink-0">
                      <p className="text-[10px] font-mono text-neutral-400 uppercase">
                        <ScrambleText as="span" text="Duration Window" trigger={activePhaseId} />
                      </p>
                      <p className="text-xs font-mono font-bold text-white">
                        <ScrambleText as="span" text={activePhase.duration} trigger={activePhaseId} />
                      </p>
                    </div>
                  </div>

                  {/* Core Description block with clean style */}
                  <div className="space-y-3">
                    <h5 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                      <ScrambleText as="span" text="Objective Definition" trigger={activePhaseId} />
                    </h5>
                    <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                      <ScrambleText as="span" text={activePhase.description} trigger={activePhaseId} />
                    </p>
                  </div>

                  {/* Operational Tags / Focus */}
                  <div className="space-y-3">
                    <h5 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                      <ScrambleText as="span" text="Cognitive Focus Parameters" trigger={activePhaseId} />
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activePhase.focusKeywords.map((tag) => (
                        <span
                          key={`${activePhaseId}-${tag}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-900 border border-neutral-800/80 text-neutral-200 hover:border-neutral-500 transition-colors duration-300"
                        >
                          <ScrambleText as="span" text={`#${tag.toLowerCase().replace(/\s+/g, '-')}`} trigger={activePhaseId} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sub-features / Spec list */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    {activePhase.systemSpecs.map((spec) => (
                      <div key={spec.label} className="p-3 bg-neutral-900/40 rounded-xl border border-neutral-900 min-w-0">
                        <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider truncate">
                          <ScrambleText as="span" text={spec.label} trigger={activePhaseId} />
                        </p>
                        <p className="text-[10px] sm:text-xs font-mono font-semibold text-white mt-1 break-all line-clamp-2">
                          <ScrambleText as="span" text={spec.value} trigger={activePhaseId} />
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Technical protocols / clues */}
                  <div className="space-y-3 pt-2">
                    <h5 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                      <ScrambleText as="span" text="Transmission Protocol Guidelines" trigger={activePhaseId} />
                    </h5>
                    <ul className="space-y-2">
                      {activePhase.detailedClues.map((clue, index) => (
                        <li key={`${activePhaseId}-${index}`} className="flex items-start gap-3 text-xs text-neutral-400 font-light leading-relaxed">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                          <span>
                            <ScrambleText as="span" text={clue} trigger={activePhaseId} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
