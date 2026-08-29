import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Goal } from '../../types';
import { GoalModal } from './GoalModal';
import {
  Target,
  Plus,
  CheckCircle,
  Circle,
  Calendar,
  Zap,
  Clock,
  Sparkles,
  Trash2,
  Edit2,
  Trophy,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const GoalManager: React.FC = () => {
  const { goals, toggleMilestone, deleteGoal, settings } = useTaskStore();

  const [filterType, setFilterType] = useState<'All' | 'Short-term' | 'Long-term'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const filteredGoals = goals.filter((g) => {
    if (filterType !== 'All' && g.type !== filterType) return false;
    return true;
  });

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  // Calculate days remaining
  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Due today';
    return `${diff} days left`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Strategic OKR Goals</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {goals.length} Active Targets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transform audacious visions into milestones, measurable key results, and XP rewards
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-2xl border border-white/10 bg-slate-900/80">
            {(['All', 'Short-term', 'Long-term'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  filterType === t
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center">
          <Target className="w-12 h-12 text-purple-500/40 mb-3" />
          <p className="text-sm font-bold text-slate-300">No OKR Goals initialized yet</p>
          <p className="text-xs text-slate-400 mt-1 mb-4">Set your short-term sprint objectives and long-term milestones</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-105"
          >
            + Create Your First OKR Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const isCompleted = goal.isCompleted || goal.progress === 100;
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;

          return (
            <div
              key={goal.id}
              className={`group relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950/90 border-emerald-500/40'
                  : 'bg-slate-900/70 border-white/10 hover:border-purple-500/40 hover:shadow-purple-950/30'
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300 uppercase">
                        {goal.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {goal.category}
                      </span>
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-emerald-400" /> ACHIEVED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-purple-300 transition-colors">
                      {goal.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (settings.enableSoundEffects) soundEngine.playClick(0.1);
                        deleteGoal(goal.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{goal.description}</p>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-slate-400">Key Results Progress</span>
                    <span className="text-purple-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]'
                          : 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_10px_#a855f7]'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Result Milestones ({completedMilestones}/{goal.milestones.length})
                  </span>

                  {goal.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(goal.id, m.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        m.completed
                          ? 'bg-slate-950/60 border-white/5 text-slate-400'
                          : 'bg-slate-900/60 border-white/10 hover:border-purple-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button className="text-slate-400 hover:text-purple-400 shrink-0">
                          {m.completed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span className={`text-xs truncate ${m.completed ? 'line-through' : ''}`}>
                          {m.title}
                        </span>
                      </div>
                      {m.dueDate && (
                        <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                          {m.dueDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Target: {goal.targetDate} ({getDaysRemaining(goal.targetDate)})</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  <span>+{goal.rewardXP} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        initialGoal={editingGoal}
      />
    </div>
  );
};
