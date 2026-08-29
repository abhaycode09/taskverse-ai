import React from 'react';
import { TiltCard } from '../3d/TiltCard';
import {
  CheckSquare,
  Calendar,
  Flame,
  Target,
  BarChart3,
  Sparkles,
  Zap,
  Volume2,
  Command,
  Database,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Quantum Task Manager',
      desc: '5 view modes (List, Kanban, Matrix, Timeline, Calendar) with subtask checklists and instant NLP parsing.',
      icon: CheckSquare,
      glow: 'rgba(6, 182, 212, 0.3)',
      badge: 'CORE ENGINE',
    },
    {
      title: 'Smart Timetable Creator',
      desc: 'Hourly 6AM-12AM time-blocking grid with AI conflict detection, recurring templates, and .ics calendar sync.',
      icon: Calendar,
      glow: 'rgba(168, 85, 247, 0.3)',
      badge: 'ZERO CLASHES',
    },
    {
      title: 'Habit Neuro-Loop System',
      desc: 'Daily consistency tracking with streak fire multipliers, 7-day completion matrices, and gamified XP rewards.',
      icon: Flame,
      glow: 'rgba(245, 158, 11, 0.3)',
      badge: 'NEURAL HABITS',
    },
    {
      title: 'Strategic OKR Goals',
      desc: 'Hierarchical goal objectives with Key Result milestones, target date countdowns, and progress rings.',
      icon: Target,
      glow: 'rgba(244, 63, 94, 0.3)',
      badge: 'OKR ALIGNMENT',
    },
    {
      title: 'Generative Focus & Soundscapes',
      desc: 'Built-in Pomodoro deep work timers with synthesized Web Audio ambient soundscapes: Rain, Deep Space, Lo-Fi.',
      icon: Volume2,
      glow: 'rgba(16, 185, 129, 0.3)',
      badge: 'AUDIO HAPTICS',
    },
    {
      title: 'Mastery Telemetry & Charts',
      desc: '6-Axis Productivity Radar, 7-Day Velocity line curves, Domain allocation bars, and Hall of Fame achievement badges.',
      icon: BarChart3,
      glow: 'rgba(59, 130, 246, 0.3)',
      badge: 'DEEP METRICS',
    },
  ];

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Engineered for Supreme Execution
          </h2>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            Every feature was built from the ground up to replace fragmented productivity tools with an integrated neural powerhouse.
          </p>
        </div>

        {/* 6 Feature TiltCards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <TiltCard
                key={idx}
                glowColor={feat.glow}
                className="p-6 flex flex-col justify-between min-h-[260px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold">
                  <span>Explore Protocol</span>
                  <span>→</span>
                </div>
              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
