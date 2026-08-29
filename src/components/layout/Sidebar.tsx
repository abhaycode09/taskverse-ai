import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Flame,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Database,
  Globe,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    profile,
    focusState,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    settings,
    setIsAiModalOpen,
  } = useTaskStore();

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'goals', label: 'OKR Goals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const handleNav = (id: typeof activePage) => {
    if (settings.enableSoundEffects) soundEngine.playClick(0.15);
    setActivePage(id);
  };

  // Format focus timer
  const minutes = Math.floor(focusState.timeLeft / 60);
  const seconds = focusState.timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Next level progress percentage
  const currentLevelBaseXP = (profile.level - 1) * 600;
  const nextLevelXP = profile.level * 600;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((profile.xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 p-4 shrink-0 select-none">
      <div className="flex flex-col gap-6">
        
        {/* Navigation List */}
        <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-2 shadow-xl">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workspaces
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Focus Timer Mini Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${focusState.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              Deep Focus
            </span>
            <span className="text-[10px] uppercase font-mono text-cyan-400">
              {focusState.mode === 'pomodoro' ? 'Focus' : 'Break'}
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-center tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent my-1">
            {timeDisplay}
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            {focusState.isRunning ? (
              <button
                onClick={pauseFocusTimer}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition-colors cursor-pointer"
              >
                <Pause className="w-3 h-3" /> Pause
              </button>
            ) : (
              <button
                onClick={startFocusTimer}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-cyan-300" /> Start
              </button>
            )}
            <button
              onClick={resetFocusTimer}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* AI Quick Strategy Banner */}
        <div
          onClick={() => setIsAiModalOpen(true)}
          className="group relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-b from-cyan-950/40 to-slate-950/80 p-3.5 shadow-lg shadow-cyan-950/50 cursor-pointer hover:border-cyan-400/50 transition-all duration-300"
        >
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                AI Auto-Pilot
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Rebalance timetable & suggest optimal high-impact focus blocks.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom: XP Level & Database Sync Pill */}
      <div className="flex flex-col gap-3">
        {/* XP Level Widget */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3 shadow-xl">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
            <span className="text-slate-300">Level {profile.level}</span>
            <span className="text-cyan-400 font-mono">{levelProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 shadow-[0_0_8px_#06b6d4]"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5">
            <span>{profile.levelTitle}</span>
            <span className="font-mono">{profile.xp} / {nextLevelXP} XP</span>
          </div>
        </div>

        {/* Database Status Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-cyan-400" />
            <span className="font-mono capitalize">{settings.dbType} DB</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
