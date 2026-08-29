import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types';
import { FocusTimerWidget } from './FocusTimerWidget';
import { QuickTasksWidget } from './QuickTasksWidget';
import { ScheduleWidget } from './ScheduleWidget';
import { HeatmapWidget } from './HeatmapWidget';
import {
  Sun,
  Moon,
  CloudSun,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Quote,
  RefreshCw,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface DashboardOverviewProps {
  onOpenTaskModal: () => void;
  onOpenTaskDetail: (task: Task) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenTaskModal,
  onOpenTaskDetail,
}) => {
  const {
    profile,
    tasks,
    habits,
    goals,
    metrics,
    setIsAiModalOpen,
    setActivePage,
    settings,
  } = useTaskStore();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    {
      text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
      author: 'James Clear',
    },
    {
      text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      author: 'Aristotle',
    },
    {
      text: 'Deep work is the superpower of the 21st century knowledge economy.',
      author: 'Cal Newport',
    },
    {
      text: 'The impediment to action advances action. What stands in the way becomes the way.',
      author: 'Marcus Aurelius',
    },
  ];

  const handleNextQuote = () => {
    if (settings.enableSoundEffects) soundEngine.playClick(0.15);
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  // Get Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun, color: 'text-amber-400' };
    if (hour < 18) return { text: 'Good Afternoon', icon: CloudSun, color: 'text-cyan-400' };
    return { text: 'Good Evening', icon: Moon, color: 'text-purple-400' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const completedToday = tasks.filter((t) => t.status === 'Done').length;
  const totalDue = tasks.length || 1;
  const completionRate = Math.round((completedToday / totalDue) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Greeting, Weather, Live Motivation */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GreetingIcon className={`w-5 h-5 ${greeting.color}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                {greeting.text}, Commander
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {profile.name}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              System health optimal. You have completed{' '}
              <span className="font-bold text-cyan-300">{completedToday} of {tasks.length} tasks</span> today with an active habit streak of{' '}
              <span className="font-bold text-amber-400">{profile.streakDays} consecutive days</span>.
            </p>
          </div>

          {/* Weather & Stoic Motivation Card */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Cyber Weather Widget */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-sm font-black text-white">24°C</span>
                  <span className="text-[10px] text-slate-400">Clear Skies</span>
                </div>
                <p className="text-[10px] text-cyan-400 font-mono">Optimal Circadian Flow</p>
              </div>
            </div>

            {/* Daily Quote / Motivation */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-sm">
              <div className="min-w-0">
                <p className="text-[11px] text-slate-200 italic line-clamp-2 leading-relaxed">
                  &quot;{quotes[quoteIndex].text}&quot;
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  — {quotes[quoteIndex].author}
                </p>
              </div>

              <button
                onClick={handleNextQuote}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Next inspiration"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Productivity Suggestions Banner */}
      <div
        onClick={() => setIsAiModalOpen(true)}
        className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-purple-950/40 backdrop-blur-xl p-4 shadow-xl cursor-pointer hover:border-cyan-400/60 transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  AI Neural Suggestion: Rebalance Evening Energy
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                  OPTIMAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Moving your 45m Coding block to 15:00 aligns with your peak circadian alertness spike.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 shrink-0">
            <span>Launch Copilot</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Dashboard 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Timer Pomodoro Widget */}
        <FocusTimerWidget />

        {/* Upcoming Quick Tasks Widget */}
        <QuickTasksWidget
          onOpenTaskModal={onOpenTaskModal}
          onOpenTaskDetail={onOpenTaskDetail}
        />

        {/* Today's Timetable Schedule Widget */}
        <ScheduleWidget />

        {/* Execution Heatmap Matrix */}
        <HeatmapWidget />
      </div>
    </div>
  );
};
