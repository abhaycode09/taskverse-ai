import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import {
  Sparkles,
  Command,
  Bell,
  Plus,
  Flame,
  Zap,
  User,
  Sliders,
  LogOut,
  Layers,
  Search,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface NavbarProps {
  onOpenTaskModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTaskModal }) => {
  const {
    activePage,
    setActivePage,
    setIsCommandPaletteOpen,
    setIsAiModalOpen,
    setIsNotificationDrawerOpen,
    notifications,
    profile,
    settings,
    isLoggedIn,
    setIsAuthModalOpen,
    setIsLoggedIn,
    showToast,
  } = useTaskStore();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (page: typeof activePage) => {
    if (settings.enableSoundEffects) soundEngine.playClick(0.15);
    setActivePage(page);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-3 pb-2 select-none">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-2xl shadow-xl">
          
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                    TaskVerse
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider font-mono uppercase hidden sm:inline">
                  Quantum OS
                </span>
              </div>
            </button>

            {/* Desktop Quick Nav Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'tasks', label: 'Tasks' },
                { id: 'timetable', label: 'Timetable' },
                { id: 'habits', label: 'Habits' },
                { id: 'goals', label: 'Goals' },
                { id: 'analytics', label: 'Analytics' },
              ].map((tab) => {
                const isActive = activePage === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNav(tab.id as typeof activePage)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white bg-white/10 shadow-inner'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center: Live Clock & Date */}
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300 shadow-inner">
            <span className="text-cyan-400 font-bold tracking-wider">{timeStr}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-400 text-[11px]">{dateStr}</span>
          </div>

          {/* Right: Actions, AI Copilot, Command Palette & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.1);
                setIsCommandPaletteOpen(true);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all duration-200 cursor-pointer group"
              title="Open Command Palette (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden xl:inline text-slate-400 text-[11px]">Search & Commands...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-slate-400 font-mono">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* AI Assistant Hologram Trigger */}
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.2);
                setIsAiModalOpen(true);
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/10 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">AI Copilot</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            </button>

            {/* Quick Add Task Button */}
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.2);
                onOpenTaskModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                setIsNotificationDrawerOpen(true);
              }}
              className="relative p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-lg shadow-rose-500/50 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-end text-right hidden sm:flex">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                    <span>Lv.{profile.level}</span>
                    <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  </div>
                  <span className="text-[9px] text-cyan-400 font-mono">{profile.xp} XP</span>
                </div>
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-slate-950/95 backdrop-blur-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white truncate">{profile.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{profile.email}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-cyan-300 font-medium">
                      <span>{profile.levelTitle}</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-400" /> {profile.streakDays}d streak
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNav('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Settings & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNav('analytics');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Productivity Mastery</span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsLoggedIn(false);
                        showToast('Logged out of TaskVerse session', 'info');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-cyan-400 hover:bg-cyan-500/10 transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In / Register</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
