import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Habit } from '../../types';
import { HabitModal } from './HabitModal';
import {
  Flame,
  Plus,
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  Zap,
  Trash2,
  Edit2,
  Calendar,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const HabitTracker: React.FC = () => {
  const { habits, toggleHabitForDate, deleteHabit, settings } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isToday = i === 6;
    return { dateStr, dayLabel, isToday };
  });

  const todayStr = new Date().toISOString().split('T')[0];

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Habit Neuro-Loop</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {habits.length} Active Protocols
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build unshakeable daily momentum, streak multipliers, and neural plasticity
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-105"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Protocol</span>
        </button>
      </div>

      {/* Habit Overview Grid Card */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
        <div className="min-w-[680px]">
          
          {/* Header Row: Days */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs font-bold text-slate-400">
            <div className="w-72">Habit Protocol & Category</div>
            <div className="flex items-center gap-3">
              {last7Days.map((d) => (
                <div
                  key={d.dateStr}
                  className={`w-9 text-center font-mono ${
                    d.isToday ? 'text-cyan-400 font-black' : 'text-slate-500'
                  }`}
                >
                  <span className="block text-[11px]">{d.dayLabel}</span>
                  <span className="text-[9px] opacity-70">
                    {d.dateStr.split('-')[2]}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-24 text-right">Current Streak</div>
            <div className="w-12 text-right">Actions</div>
          </div>

          {/* Habit Rows */}
          <div className="space-y-3">
            {habits.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <Flame className="w-10 h-10 text-amber-500/40 mb-3" />
                <p className="text-sm font-bold text-slate-300">No habit protocols defined yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Initialize your first daily habit to start building neural streaks</p>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-105"
                >
                  + Create Your First Habit
                </button>
              </div>
            ) : (
              habits.map((habit) => {
                const isDoneToday = habit.completedDates.includes(todayStr);

              return (
                <div
                  key={habit.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    isDoneToday
                      ? 'bg-slate-900/80 border-cyan-500/30 shadow-md'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Habit Info */}
                  <div className="w-72 flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleHabitForDate(habit.id, todayStr)}
                      className="cursor-pointer text-slate-400 hover:text-cyan-400 shrink-0 transition-transform active:scale-90"
                    >
                      {isDoneToday ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-6 h-6 hover:text-cyan-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => handleEdit(habit)}
                          className={`text-xs font-bold truncate cursor-pointer hover:text-cyan-300 transition-colors ${
                            isDoneToday ? 'text-slate-100' : 'text-slate-300'
                          }`}
                        >
                          {habit.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="font-mono text-cyan-400">+{habit.xpReward} XP</span>
                        <span>•</span>
                        <span>{habit.timeOfDay}</span>
                        <span>•</span>
                        <span className="text-slate-500">{habit.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Completion Dots */}
                  <div className="flex items-center gap-3">
                    {last7Days.map((d) => {
                      const isCompleted = habit.completedDates.includes(d.dateStr);

                      return (
                        <button
                          key={d.dateStr}
                          onClick={() => toggleHabitForDate(habit.id, d.dateStr)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isCompleted
                              ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                              : 'bg-white/5 text-slate-600 hover:bg-white/10 hover:text-slate-400 border border-white/5'
                          }`}
                          title={`Toggle ${d.dateStr}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Streak Flame */}
                  <div className="w-24 text-right">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>

                  {/* Edit / Delete */}
                  <div className="w-12 text-right flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(habit)}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-200 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (settings.enableSoundEffects) soundEngine.playClick(0.1);
                        deleteHabit(habit.id);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        initialHabit={editingHabit}
      />
    </div>
  );
};
