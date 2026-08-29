import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Habit, TaskCategory } from '../../types';
import { X, Flame, Sparkles } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHabit?: Habit | null;
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, initialHabit }) => {
  const { addHabit, updateHabit, settings } = useTaskStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Health');
  const [timeOfDay, setTimeOfDay] = useState<Habit['timeOfDay']>('Morning');
  const [color, setColor] = useState('#06b6d4');
  const [xpReward, setXpReward] = useState(50);

  const categories: TaskCategory[] = ['Health', 'Gym', 'Study', 'Coding', 'Work', 'Personal', 'Finance'];
  const timesOfDay: Habit['timeOfDay'][] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];
  const colors = ['#06b6d4', '#f59e0b', '#10b981', '#8b5cf6', '#f43f5e', '#ec4899'];

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description);
      setCategory(initialHabit.category);
      setTimeOfDay(initialHabit.timeOfDay);
      setColor(initialHabit.color);
      setXpReward(initialHabit.xpReward);
    } else {
      setName('');
      setDescription('');
      setCategory('Health');
      setTimeOfDay('Morning');
      setColor('#06b6d4');
      setXpReward(50);
    }
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);

    if (initialHabit) {
      updateHabit(initialHabit.id, {
        name,
        description,
        category,
        timeOfDay,
        color,
        xpReward,
      });
    } else {
      addHabit({
        name,
        description,
        category,
        frequency: 'Daily',
        timeOfDay,
        color,
        iconName: 'Flame',
        xpReward,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {initialHabit ? 'Edit Habit Routine' : 'Create Atomic Habit'}
              </h2>
              <p className="text-xs text-slate-400">Build neuroplastic consistency and earn daily XP</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Habit Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 20-min Transcendental Meditation"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specific cue, action, and reward..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as Habit['timeOfDay'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {timesOfDay.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Color Accent</label>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-lg transition-all cursor-pointer ${
                      color === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">XP Reward Value</label>
              <input
                type="number"
                min={10}
                max={200}
                step={10}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer hover:scale-105"
            >
              {initialHabit ? 'Update Habit' : 'Initialize Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
