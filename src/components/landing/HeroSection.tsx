import React from 'react';
import { HologramSphere } from '../3d/HologramSphere';
import { useTaskStore } from '../../store/useTaskStore';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Play,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Calendar,
  Command,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExploreDemo }) => {
  const { settings } = useTaskStore();

  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-cyan-500/30 backdrop-blur-xl shadow-lg shadow-cyan-500/10 hover:border-cyan-400 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold text-slate-200">
              TaskVerse 4.0 Neural Release
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase">
              • Quantum Productivity OS
            </span>
          </div>
        </div>

        {/* Massive Cinematic Headline */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            The Infinite <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 bg-clip-text text-transparent">
              AI Productivity OS
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Unify your Daily Tasks, Smart Timetable, Habit Neuro-Loops, Strategic OKR Goals, and Focus Engine into one fluid, cinematic workspace.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => {
              if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
              onGetStarted();
            }}
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span>Launch TaskVerse Free</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={() => {
              if (settings.enableSoundEffects) soundEngine.playClick(0.15);
              onExploreDemo();
            }}
            className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 font-bold text-sm border border-white/15 backdrop-blur-xl transition-all duration-200 cursor-pointer hover:scale-105 w-full sm:w-auto"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Interactive Live Demo</span>
          </button>
        </div>

        {/* Center 3D Visualization & Floating Glass Cards */}
        <div className="relative mx-auto max-w-5xl flex items-center justify-center">
          {/* Main 3D Hologram Sphere */}
          {settings.enable3D && (
            <div className="relative z-10 my-[-40px]">
              <HologramSphere size={440} />
            </div>
          )}

          {/* Left Floating Card: Live Focus Sprint */}
          <div className="hidden md:flex absolute -left-4 top-1/4 z-20 flex-col p-4 rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50 w-64 animate-bounce" style={{ animationDuration: '6s' }}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5 fill-cyan-400" /> Deep Work Flow
              </span>
              <span className="font-mono text-emerald-400">98% Sync</span>
            </div>
            <div className="text-xl font-mono font-black text-white my-1">
              24:18 <span className="text-[10px] text-slate-400 font-normal">REMAINING</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 w-3/4 shadow-[0_0_8px_#06b6d4]" />
            </div>
          </div>

          {/* Right Floating Card: AI Autopilot Schedule */}
          <div className="hidden md:flex absolute -right-4 top-1/3 z-20 flex-col p-4 rounded-2xl border border-purple-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-purple-950/50 w-64 animate-bounce" style={{ animationDuration: '7s' }}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Sparkles className="w-3.5 h-3.5" /> AI Schedule Optimizer
              </span>
              <span className="font-mono text-cyan-400">0 Clashes</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Distributed Systems Lecture aligned with afternoon focus peak.
            </p>
          </div>
        </div>

        {/* Live Statistics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { label: 'Tasks Executed', val: '2.4M+', change: '+99.8% on-time' },
            { label: 'Deep Focus Logged', val: '480,000h', change: 'Zero distractions' },
            { label: 'Active Habit Streaks', val: '94.2%', change: 'Consistency rate' },
            { label: 'Engine Latency', val: '< 12ms', change: 'Offline first' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl text-center shadow-lg"
            >
              <div className="text-2xl font-black text-white font-mono tracking-tight">
                {stat.val}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">{stat.label}</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-1">{stat.change}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
