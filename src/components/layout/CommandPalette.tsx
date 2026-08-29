import React, { useState, useEffect, useMemo } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import {
  Search,
  CheckSquare,
  Calendar,
  Flame,
  Target,
  BarChart3,
  Settings,
  Sparkles,
  Plus,
  Play,
  Sun,
  Moon,
  Zap,
  ArrowRight,
  Database,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface CommandPaletteProps {
  onOpenTaskModal: () => void;
}

interface ActionItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  subtitle?: string;
  run: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onOpenTaskModal }) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActivePage,
    tasks,
    habits,
    goals,
    settings,
    updateSettings,
    startFocusTimer,
    setIsAiModalOpen,
    showToast,
  } = useTaskStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close when escape is pressed
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Built-in Actions List
  const allActions = useMemo((): ActionItem[] => {
    const staticActions: ActionItem[] = [
      {
        id: 'new_task',
        title: 'Create New Task',
        category: 'Actions',
        icon: Plus,
        shortcut: 'N',
        run: () => {
          onOpenTaskModal();
        },
      },
      {
        id: 'ai_copilot',
        title: 'Launch AI Productivity Copilot',
        category: 'AI Tools',
        icon: Sparkles,
        shortcut: 'A',
        run: () => {
          setIsAiModalOpen(true);
        },
      },
      {
        id: 'start_focus',
        title: 'Start 25-Min Deep Work Timer',
        category: 'Focus',
        icon: Play,
        shortcut: 'P',
        run: () => {
          startFocusTimer();
          showToast('Deep Focus Session Initiated', 'success');
        },
      },
      {
        id: 'nav_dashboard',
        title: 'Go to Dashboard Overview',
        category: 'Navigation',
        icon: Zap,
        run: () => setActivePage('dashboard'),
      },
      {
        id: 'nav_tasks',
        title: 'Go to Task Manager',
        category: 'Navigation',
        icon: CheckSquare,
        run: () => setActivePage('tasks'),
      },
      {
        id: 'nav_timetable',
        title: 'Go to Smart Timetable',
        category: 'Navigation',
        icon: Calendar,
        run: () => setActivePage('timetable'),
      },
      {
        id: 'nav_habits',
        title: 'Go to Habit Tracker',
        category: 'Navigation',
        icon: Flame,
        run: () => setActivePage('habits'),
      },
      {
        id: 'nav_goals',
        title: 'Go to Goal Manager (OKRs)',
        category: 'Navigation',
        icon: Target,
        run: () => setActivePage('goals'),
      },
      {
        id: 'nav_analytics',
        title: 'Go to Analytics & Mastery',
        category: 'Navigation',
        icon: BarChart3,
        run: () => setActivePage('analytics'),
      },
      {
        id: 'nav_settings',
        title: 'Go to Settings & Database Hub',
        category: 'Navigation',
        icon: Settings,
        run: () => setActivePage('settings'),
      },
      {
        id: 'toggle_theme',
        title: `Switch Theme to ${settings.theme === 'dark' ? 'Apple Frost Light' : 'Futuristic Dark'}`,
        category: 'Preferences',
        icon: settings.theme === 'dark' ? Sun : Moon,
        run: () => {
          updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
        },
      },
    ];

    // Dynamic tasks
    const taskActions = tasks.slice(0, 8).map((t) => ({
      id: `task_${t.id}`,
      title: `Task: ${t.title}`,
      category: 'Tasks',
      icon: CheckSquare,
      subtitle: `${t.priority} • ${t.category} • ${t.status}`,
      run: () => {
        setActivePage('tasks');
      },
    }));

    // Dynamic goals
    const goalActions = goals.slice(0, 4).map((g) => ({
      id: `goal_${g.id}`,
      title: `Goal: ${g.title}`,
      category: 'Goals',
      icon: Target,
      subtitle: `${g.progress}% completed • Target: ${g.targetDate}`,
      run: () => {
        setActivePage('goals');
      },
    }));

    return [...staticActions, ...taskActions, ...goalActions];
  }, [tasks, goals, settings.theme, onOpenTaskModal, setIsAiModalOpen, startFocusTimer, setActivePage, updateSettings, showToast]);

  // Filtered Actions
  const filteredActions = useMemo(() => {
    if (!search.trim()) return allActions;
    const q = search.toLowerCase();
    return allActions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q))
    );
  }, [search, allActions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCommandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          if (settings.enableSoundEffects) soundEngine.playClick(0.2);
          filteredActions[selectedIndex].run();
          setIsCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, filteredActions, selectedIndex, setIsCommandPaletteOpen, settings.enableSoundEffects]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-950/90 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search tasks, habits, goals..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Action Items List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching commands or resources found for &quot;{search}&quot;.
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    if (settings.enableSoundEffects) soundEngine.playClick(0.2);
                    action.run();
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-200 truncate">{action.title}</span>
                      {action.subtitle && (
                        <span className="text-[10px] text-slate-400 truncate">{action.subtitle}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase">
                      {action.category}
                    </span>
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-cyan-400 font-mono">
                        {action.shortcut}
                      </kbd>
                    )}
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-t border-white/10 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-[10px]">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white/10 px-1 py-0.5 rounded text-[10px]">↵</kbd> to execute
            </span>
          </div>
          <span className="text-cyan-400 font-mono font-medium">TaskVerse Command Engine</span>
        </div>
      </div>
    </div>
  );
};
