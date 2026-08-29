import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Sparkles, Globe, Shield, Terminal, Heart, Zap } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const Footer: React.FC = () => {
  const { setActivePage, setIsAuthModalOpen, settings } = useTaskStore();

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl py-12 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                TaskVerse AI
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Ultra-luxurious, futuristic AI-powered productivity ecosystem for high-velocity builders, scholars, and visionary executors.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => setActivePage('dashboard')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('tasks')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Task Manager
            </button>
            <button
              onClick={() => setActivePage('timetable')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Timetable Grid
            </button>
            <button
              onClick={() => setActivePage('habits')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Habit Loops
            </button>
            <button
              onClick={() => setActivePage('goals')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              OKR Goals
            </button>
            <button
              onClick={() => setActivePage('analytics')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Mastery Radar
            </button>
            <button
              onClick={() => setActivePage('settings')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Settings
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Operational (100% Uptime)</span>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 TaskVerse AI OS. All quantum protocols reserved.</p>
          <div className="flex items-center gap-2">
            <span>Engineered with</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>for superhuman productivity</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
