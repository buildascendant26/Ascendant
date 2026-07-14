import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is Ascendant 2026?", a: "DPS Bangalore East's premier interschool hackathon, themed \"Decode. Build. Pitch.\" — a two-day, three-phase competition." },
  { q: "When and where is it held?", a: "17th–18th July 2026, at Delhi Public School, Bangalore East, Karnataka." },
  { q: "What time should participants report?", a: "8:00 AM on Day 1, for check-in and event instructions." },
  { q: "What's the registration deadline?", a: "14th July 2026. Late registrations may not be accommodated due to limited capacity." },
  { q: "Who can participate?", a: "Students in grades IX to XII." },
  { q: "What's the team size requirement?", a: "Minimum 2, maximum 4 participants per team." },
  { q: "What is Phase 1 of the competition?", a: "Capture the Flag (CTF) — a cybersecurity challenge involving puzzles, vulnerabilities, and hidden flags, testing problem-solving and teamwork." },
  { q: "What is Phase 2 of the competition?", a: "Build Sprint — teams get a problem statement and build a working prototype from scratch (AI, web dev, cybersecurity, automation, or social impact)." },
  { q: "What is Phase 3 of the competition?", a: "Final Pitch — top teams present to a panel of industry professionals, educators, and tech experts." },
  { q: "How are teams judged?", a: "On creativity, technical excellence, usability, presentation, and overall impact." },
  { q: "What must participants bring?", a: "Laptop, mobile phone, laptop charger, and any additional accessories needed for development." },
  { q: "What facilities are provided at the venue?", a: "Internet access, breakfast, lunch, stalls, and workspace with power access." },
  { q: "Is there a dress code?", a: "Yes — track pants are required. Event T-shirts are provided, and changing rooms will be arranged." },
  { q: "Is accommodation or transport provided for outstation teams?", a: "Not specified in the brochure — schools should confirm directly with organisers." },
  { q: "Is there a chaperone-to-student ratio or limit on accompanying teachers?", a: "Not specified — check with the organising school in advance." },
  { q: "What is the emergency contact or first-aid protocol during the event?", a: "Not specified — teachers-in-charge should request this ahead of time." },
  { q: "Do all participants get certificates, or only winners?", a: "Not specified — confirm with organisers." },
  { q: "What mentorship or help-desk support is available during the Build Sprint?", a: "Not specified — worth clarifying so teams know what support they can access if stuck." },
  { q: "How do I register for the event?", a: "Via ascendant2026.tech/register." },
  { q: "Who do I contact for questions about registration, logistics, or sponsorships?", a: "Phone: +91 7975924841 / +91 7259327937, Email: support@ascendant2026.tech, Instagram: @ascendant.2026" },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="min-h-screen py-24 md:py-36 px-6 md:px-16 w-full flex flex-col justify-center relative border-b border-neutral-900 bg-black/50 overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-neutral-900/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] rounded-full bg-neutral-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-30" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="mb-12 md:mb-16 space-y-4">
          <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-800 animate-pulse-slow" />
            04 / FAQ
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-neutral-600 bg-neutral-950" : "border-neutral-900 bg-neutral-950/20 hover:border-neutral-800"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-4 text-sm md:text-base font-medium text-white">
                    <span className="font-mono text-[10px] text-neutral-500 tabular-nums shrink-0 w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5 pt-0">
                    <div className="pl-10 text-sm md:text-base text-neutral-400 leading-relaxed font-light border-l border-neutral-800 pl-6 ml-10">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
