import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { settings, showToast } = useTaskStore();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Quantum Free',
      badge: 'STARTER',
      price: 0,
      period: 'forever free',
      desc: 'Essential daily task tracking and timetable builder for focused individuals.',
      features: [
        'Up to 100 Active Mission Tasks',
        'Weekly Hourly Timetable Grid (07:00-23:00)',
        'Up to 5 Daily Habit Neuro-Loops',
        'Basic Pomodoro Focus Timer',
        'Browser LocalStorage offline sync',
        'Standard 2D & 3D interface',
      ],
      popular: false,
      cta: 'Get Started Free',
    },
    {
      name: 'Singularity Pro',
      badge: 'MOST POPULAR',
      price: isAnnual ? 15 : 19,
      period: isAnnual ? '/month (billed annually)' : '/month',
      desc: 'Full quantum AI capabilities, unlimited habits, OKR goals, and audio synthesizer.',
      features: [
        'Unlimited Tasks & Subtask Checklists',
        'AI Timetable Conflict Resolution & Auto-Scheduler',
        'Unlimited Habits with Streak Fire Multipliers',
        'Strategic OKR Goals with Key Result Checklists',
        'Web Audio Synthesizer & Ambient Soundscapes',
        '6-Axis Radar Mastery & 7-Day Velocity Telemetry',
        'Google & Apple Calendar Sync (.ics export)',
        'Full 3D Hologram Sphere & Cyber Shaders',
      ],
      popular: true,
      cta: 'Upgrade to Singularity Pro',
    },
    {
      name: 'Cosmic Enterprise',
      badge: 'ORGANIZATIONAL',
      price: isAnnual ? 39 : 49,
      period: isAnnual ? '/seat/mo (billed annually)' : '/seat/mo',
      desc: 'Collaborative team mission control, multi-database sync, and custom AI copilots.',
      features: [
        'Everything in Singularity Pro',
        'Direct Database Connect (Supabase, Firebase, Postgres, Mongo)',
        'Multi-Agent Autonomous Strategy Optimization',
        'Custom Team Shared Timetables & Delegation',
        'Priority 24/7 Quantum Support & Dedicated SLAs',
        'Custom Security Encryption Keys & Audit Logs',
      ],
      popular: false,
      cta: 'Deploy Cosmic Suite',
    },
  ];

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            TRANSPARENT VALUE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Investment in Superhuman Output
          </h2>
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            One platform to eliminate five subscriptions. Experience the difference in your first week.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                setIsAnnual(!isAnnual);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                isAnnual ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Annual
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SAVE 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col justify-between p-8 rounded-3xl border transition-all duration-300 backdrop-blur-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-cyan-950/60 via-slate-900/90 to-slate-950/95 border-cyan-500/50 shadow-2xl shadow-cyan-950/60 lg:-translate-y-2'
                  : 'bg-slate-900/60 border-white/10 shadow-xl hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] font-mono uppercase tracking-wider shadow-lg shadow-cyan-500/30">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white">{plan.name}</h3>
                  {!plan.popular && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/5 text-slate-400 border border-white/10">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 my-4 font-mono">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    \${plan.price}
                  </span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">{plan.desc}</p>

                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    INCLUDED FEATURES:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
                  onSelectPlan(plan.name);
                  showToast(`Selected ${plan.name} configuration`, 'success');
                }}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
