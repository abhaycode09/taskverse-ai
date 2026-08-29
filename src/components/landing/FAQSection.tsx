import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { soundEngine } from '../../store/soundEffects';

export const FAQSection: React.FC = () => {
  const { settings } = useTaskStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does TaskVerse AI differ from typical to-do lists like Todoist or Notion?',
      a: 'TaskVerse AI is a unified productivity operating system that fuses atomic task tracking with an hourly weekly timetable builder, habit streak gamification, OKR milestone hierarchies, deep focus ambient sound generators, and 6-axis productivity telemetry. Everything syncs without needing 5 separate plugins or subscriptions.',
    },
    {
      q: 'Does TaskVerse AI work offline?',
      a: 'Yes! TaskVerse is engineered offline-first. All your tasks, schedules, habits, and focus metrics are immediately persisted in browser LocalStorage with zero latency. When connected, you can also sync directly with Supabase, Firebase, MongoDB, or PostgreSQL.',
    },
    {
      q: 'Can I sync my timetable with Google Calendar or Apple Calendar?',
      a: 'Absolutely. TaskVerse has built-in one-click iCal (.ics) export that imports cleanly into Apple Calendar, Google Calendar, and Microsoft Outlook with recurring weekly schedules intact.',
    },
    {
      q: 'How does the AI Schedule Conflict Resolution work?',
      a: 'Our algorithmic scheduler monitors every time block on your grid in real time. If two lecture or work sessions overlap, the conflict banner highlights the clash and provides a one-click "Auto-Resolve" action that shifts subsequent blocks into optimal circadian slots.',
    },
    {
      q: 'Is there any lag with the 3D Holographic Sphere and animations?',
      a: 'No. The Three.js sphere and ambient particle systems run GPU-accelerated WebGL shaders at a locked 60 FPS. If you are on an ultra low-power device, you can toggle 3D off in Settings with a single click.',
    },
  ];

  const handleToggle = (idx: number) => {
    if (settings.enableSoundEffects) soundEngine.playClick(0.1);
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            INTELLIGENCE HUB
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Everything you need to know about the TaskVerse ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
