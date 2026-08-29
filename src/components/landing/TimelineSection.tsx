import React from 'react';
import { Zap, Brain, Shield, Sparkles } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const steps = [
    {
      phase: '01. Instant Capture & NLP',
      title: 'Zero Friction Task Ingestion',
      desc: 'Type natural commands like "/task Write Research tomorrow 5pm !High #Study" and let the quantum parser structure deadlines and tags automatically.',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      phase: '02. AI Schedule Synthesis',
      title: 'Automated Timetable Alignment',
      desc: 'Our engine detects calendar overlaps, balances cognitive load according to your circadian rhythm, and reserves unbroken deep work blocks.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
    },
    {
      phase: '03. Unbroken Deep Work Flow',
      title: 'Distraction Shield & Audio Haptics',
      desc: 'Launch immersive Pomodoro sprints with generative ambient rain and space soundscapes that lock your brain into pure alpha-wave focus.',
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
    },
    {
      phase: '04. Mastery & Gamified Ascendance',
      title: 'XP Multipliers & Habit Longevity',
      desc: 'Earn XP on every finished key result, level up from Flow Initiate to Cosmic Titan, and analyze multidimensional 6-axis performance radars.',
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            PRODUCTIVITY EVOLUTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            How TaskVerse Unlocks Peak Flow
          </h2>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            A 4-step cyclical framework designed by cognitive neuroscientists and world-class engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;

            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} p-[1px] shadow-lg mb-4`}
                  >
                    <div className="w-full h-full rounded-[15px] bg-slate-950 flex items-center justify-center text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {s.phase}
                  </span>
                  <h3 className="text-sm font-extrabold text-white mt-1 mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-white/5 font-mono text-[10px] text-slate-500">
                  PHASE 0{idx + 1} ACTIVE
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
