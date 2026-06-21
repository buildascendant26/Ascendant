/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Layers, MapPin } from 'lucide-react';
import { EventSlot } from '../types';
import { TimelineBackground } from './TimelineBackground';
import ScrambleText from './ScrambleText';

export const Timeline: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'17' | '18'>('17');
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>('slot-1');

  const events: EventSlot[] = [
    // July 17 - Day I
    {
      id: 'slot-1',
      date: '17',
      time: '08:00 - 08:30',
      title: 'Reporting & Registrations',
      subtitle: 'Welcome & workstation setup',
      description: 'Arrive at the main venue entrance. Complete your physical sign-in process, pick up your event credentials, get assigned to your hacking station, and ensure your development environment is fully setup and online.',
      venue: 'Main Atrium',
      duration: '30 min',
      category: 'experience'
    },
    {
      id: 'slot-2',
      date: '17',
      time: '08:30 - 09:00',
      title: 'Breakfast',
      subtitle: 'Morning fueling & networking',
      description: 'Enjoy a normal hot breakfast to kickstart your day. Network with other participants, meet potential partners, and prepare your mindset before the sessions kick off.',
      venue: 'Dining Hall',
      duration: '30 min',
      category: 'experience'
    },
    {
      id: 'slot-3',
      date: '17',
      time: '09:00 - 10:00',
      title: 'Opening Ceremony',
      subtitle: 'Introduction & rules overview',
      description: 'An exciting welcome session! Meet the organizing team, sponsors, and esteemed judges. We will cover the competition structure, evaluation criteria, and reveal key guidelines to guide your project.',
      venue: 'Main Stage',
      duration: '60 min',
      category: 'keynote'
    },
    {
      id: 'slot-4',
      date: '17',
      time: '10:00 - 13:00',
      title: 'Capture the Flag',
      subtitle: 'Security & decryption challenges',
      description: 'Kickstart the hackathon with our technical CTF challenges. Work with your teammates to solve a series of security, decryption, and analytical puzzles to gather flags and reveal the final build challenges.',
      venue: 'Hacking Area',
      duration: '180 min',
      category: 'hacking'
    },
    {
      id: 'slot-5',
      date: '17',
      time: '13:00 - 13:30',
      title: 'Lunch',
      subtitle: 'Mid-day food break',
      description: 'Take a well-deserved midday break. Relax, step away from the screen, and enjoy a delicious catered hot lunch while socializing with other participants in the dining hall.',
      venue: 'Dining Hall',
      duration: '30 min',
      category: 'experience'
    },
    {
      id: 'slot-6',
      date: '17',
      time: '14:00 - 17:30',
      title: 'Building Time & Go Home',
      subtitle: 'Project design & baseline code kickoff',
      description: 'Begin drafting your custom application schemas, organize your system components, and start building your fundamental features. Get your baseline code working smoothly, plan your workflow with your team, and then rest up for Day II.',
      venue: 'Hacking Area',
      duration: '210 min',
      category: 'hacking'
    },

    // July 18 - Day II
    {
      id: 'slot-7',
      date: '18',
      time: '08:00 - 10:00',
      title: 'Reporting & Building Time',
      subtitle: 'Final touches & system optimization',
      description: 'Arrive back early for Day II. Spend these intensive hours squashing last-minute bugs, refining your user interface styling, finalizing your local database states, and practicing your pitch demo.',
      venue: 'Hacking Area',
      duration: '120 min',
      category: 'hacking'
    },
    {
      id: 'slot-8',
      date: '18',
      time: '10:00 - 17:00',
      title: 'Pitch & Judge',
      subtitle: 'Project demonstrations & panel screening',
      description: 'The grand showcase. Present your fully functional projects live on stage to our panel of judges. Step-by-step, demonstrate your core features, explain your design choices, and address jury questions.',
      venue: 'Main Stage',
      duration: '420 min',
      category: 'keynote'
    },
    {
      id: 'slot-9',
      date: '18',
      time: '17:00 - 17:30',
      title: 'Closing Ceremony & Prizes',
      subtitle: 'Winning announcements & prize distribution',
      description: 'Celebrate the breakthroughs of all participants. We\'ll recap the hackathon highlights, announce the winning builds, distribute custom trophies and prizes, and celebrate the conclusion of the event.',
      venue: 'Main Stage',
      duration: '30 min',
      category: 'keynote'
    },
  ];

  const filteredEvents = events.filter((e) => e.date === activeDay);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'hacking': return ' bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'experience': return ' bg-neutral-900 text-neutral-300 border-neutral-800';
      case 'keynote': return ' bg-zinc-900 text-zinc-300 border-zinc-800';
      default: return ' bg-neutral-800 text-white border-neutral-700';
    }
  };

  return (
    <section id="program" className="min-h-[70vh] py-12 md:py-16 px-4 md:px-8 w-full border-b border-neutral-900 bg-black relative overflow-hidden">
      <TimelineBackground activeDay={activeDay} />
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <p className="font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase">02 / CHRONOLOGY</p>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">
            Program Chronology
          </h2>
          <p className="text-neutral-400 font-light max-w-md mx-auto text-xs md:text-sm">
            Engineered throughout 48 intensive hours, balancing critical hacking challenges, meals, and live pitches.
          </p>
        </div>

        {/* Date Toggles */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-neutral-950 border border-neutral-900 rounded-full">
            <button
              id="date-toggle-17"
              onClick={() => { setActiveDay('17'); setExpandedSlotId('slot-1'); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider transition-all duration-300 ${
                activeDay === '17' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              DAY I: 17 JULY
            </button>
            <button
              id="date-toggle-18"
              onClick={() => { setActiveDay('18'); setExpandedSlotId('slot-7'); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[11px] tracking-wider transition-all duration-300 ${
                activeDay === '18' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              DAY II: 18 JULY
            </button>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="space-y-2">
          {filteredEvents.map((slot) => {
            const isExpanded = expandedSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className={`border rounded-xl transition-all duration-300 overflow-hidden bg-neutral-950/70 border-neutral-900 hover:border-neutral-800 ${
                  isExpanded ? 'border-neutral-800 bg-neutral-950' : ''
                }`}
              >
                {/* Accordion Row Header */}
                <button
                  id={`slot-${slot.id}-header-btn`}
                  onClick={() => setExpandedSlotId(isExpanded ? null : slot.id)}
                  className="w-full text-left p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 focus:outline-none cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1">
                    {/* Time anchor */}
                    <div className="font-mono text-xs text-neutral-400 font-medium tracking-wider min-w-[100px]">
                      {slot.time}
                    </div>
                    {/* Title and subtitle */}
                    <div>
                      <h4 className="font-display text-sm md:text-base font-bold text-white tracking-tight">
                        <ScrambleText as="span" text={slot.title} trigger={activeDay} />
                      </h4>
                      <p className="text-[11px] text-neutral-500 italic font-light">
                        <ScrambleText as="span" text={slot.subtitle} trigger={activeDay} />
                      </p>
                    </div>
                  </div>

                  {/* Badges / Control */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider border rounded ${getCategoryTheme(slot.category)}`}>
                      {slot.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                      {slot.duration}
                    </span>
                  </div>
                </button>

                {/* Animated expandable content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      id={`slot-content-${slot.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-neutral-900/60 text-xs text-neutral-400">
                        {/* Summary Block */}
                        <div className="space-y-2">
                          <p className="font-light leading-relaxed text-neutral-400"><ScrambleText as="span" text={slot.description} trigger={activeDay} /></p>
                          <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              <ScrambleText as="span" text={slot.venue} trigger={activeDay} />
                            </span>
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-neutral-400" />
                              Duration: <ScrambleText as="span" text={slot.duration} trigger={activeDay} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
