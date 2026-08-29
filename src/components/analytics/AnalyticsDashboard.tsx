import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import {
  VelocityLineChart,
  CategoryBarChart,
  ProductivityRadarChart,
  PriorityDonutChart,
} from './Charts';
import {
  Trophy,
  Zap,
  Flame,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Brain,
  Shield,
  Activity,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { metrics, achievements, profile } = useTaskStore();

  const latestScore = metrics[metrics.length - 1]?.score || 88;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Productivity Mastery & Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Neuro-Metrics v4
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Deep telemetry on cognitive output, focus duration, habit consistency, and unlocked badges
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Productivity Score */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Overall Score</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{latestScore}%</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +6.4%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Top 2% among all executors</p>
        </div>

        {/* Total Focus Hours */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Logged Deep Focus</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{profile.totalFocusHours}</span>
            <span className="text-xs font-bold text-slate-400 font-mono">hours</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">+14.2 hrs logged this week</p>
        </div>

        {/* Habit Streak */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{profile.streakDays}</span>
            <span className="text-xs font-bold text-slate-400 font-mono">days</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Personal Best: 45 days</p>
        </div>

        {/* Accomplished Tasks */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-slate-950/90 backdrop-blur-xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">
              {profile.totalTasksCompleted}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">tasks</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">94.8% on-time completion rate</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Velocity Line Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <h3 className="text-xs font-extrabold text-white">Productivity Velocity Trajectory</h3>
              <p className="text-[10px] text-slate-400 font-mono">7-Day Score Progression Trend</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
              Live Feed
            </span>
          </div>
          <VelocityLineChart metrics={metrics} />
        </div>

        {/* 6-Axis Radar Mastery Chart (1 Col) */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
            <div>
              <h3 className="text-xs font-extrabold text-white">Mastery Radar</h3>
              <p className="text-[10px] text-slate-400 font-mono">Multidimensional Balance</p>
            </div>
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <ProductivityRadarChart />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Hours Bar Chart */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <h3 className="text-xs font-extrabold text-white">Focus Time by Domain</h3>
              <p className="text-[10px] text-slate-400 font-mono">Weekly Allocation Breakdown</p>
            </div>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <CategoryBarChart />
        </div>

        {/* Priority Donut Chart */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <h3 className="text-xs font-extrabold text-white">Task Priority Distribution</h3>
              <p className="text-[10px] text-slate-400 font-mono">Cognitive Load Balance</p>
            </div>
            <Shield className="w-4 h-4 text-rose-400" />
          </div>
          <PriorityDonutChart />
        </div>
      </div>

      {/* Achievement Badges Gallery */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Achievement Hall of Fame</h3>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} Badges
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            Rank: {profile.levelTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all duration-200 ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-950/40 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={`p-2.5 rounded-xl ${
                    ach.unlocked ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-600'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1">
                  {ach.unlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-100">{ach.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ach.description}</p>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] font-mono">
                <span className="text-amber-400 font-bold">+{ach.xpValue} XP</span>
                <span className="uppercase text-slate-500">{ach.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
