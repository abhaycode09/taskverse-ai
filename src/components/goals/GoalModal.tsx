import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Goal, Milestone, TaskCategory } from '../../types';
import { X, Target, Plus, Trash2, Calendar, CheckSquare } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGoal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, initialGoal }) => {
  const { addGoal, updateGoal, settings } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Coding');
  const [type, setType] = useState<Goal['type']>('Short-term');
  const [targetDate, setTargetDate] = useState('2026-10-31');
  const [color, setColor] = useState('#06b6d4');
  const [rewardXP, setRewardXP] = useState(500);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const categories: TaskCategory[] = ['Coding', 'Study', 'College', 'Gym', 'Health', 'Finance', 'Work', 'Personal'];
  const colors = ['#06b6d4', '#a855f7', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setCategory(initialGoal.category);
      setType(initialGoal.type);
      setTargetDate(initialGoal.targetDate);
      setColor(initialGoal.color);
      setRewardXP(initialGoal.rewardXP);
      setMilestones(initialGoal.milestones || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Coding');
      setType('Short-term');
      setTargetDate('2026-10-31');
      setColor('#06b6d4');
      setRewardXP(500);
      setMilestones([
        { id: 'm1', title: 'Phase 1: Research & Discovery', completed: true },
        { id: 'm2', title: 'Phase 2: Core Implementation', completed: false },
      ]);
    }
  }, [initialGoal, isOpen]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones((prev) => [
      ...prev,
      { id: `m_${Date.now()}`, title: newMilestoneTitle.trim(), completed: false },
    ]);
    setNewMilestoneTitle('');
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);

    if (initialGoal) {
      updateGoal(initialGoal.id, {
        title,
        description,
        category,
        type,
        targetDate,
        color,
        rewardXP,
        milestones,
      });
    } else {
      addGoal({
        title,
        description,
        category,
        type,
        targetDate,
        color,
        rewardXP,
        milestones,
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
        className="relative w-full max-w-lg max-h-[90vh] rounded-3xl border border-white/20 bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {initialGoal ? 'Edit OKR Objective' : 'Design Strategic OKR Goal'}
              </h2>
              <p className="text-xs text-slate-400">Break down monumental visions into tangible key results</p>
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
            <label className="block text-xs font-bold text-slate-300 mb-1">Goal Objective Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Autonomous Multi-Agent AI Frameworks"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Strategic Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this matters and how success is measured..."
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
              <label className="block text-xs font-bold text-slate-300 mb-1">Horizon Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Goal['type'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="Short-term">Short-term Sprint (1-3 Mo)</option>
                <option value="Long-term">Long-term Horizon (6-12 Mo)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Completion XP Reward</label>
              <input
                type="number"
                min={100}
                max={2000}
                step={50}
                value={rewardXP}
                onChange={(e) => setRewardXP(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Milestones Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-purple-400" /> Key Result Milestones
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {milestones.length} Milestones
              </span>
            </label>

            <div className="space-y-1.5 mb-2">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs"
                >
                  <span className={m.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {m.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
                placeholder="Add Key Result milestone..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-purple-500/20 hover:text-purple-300 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer hover:scale-105"
            >
              {initialGoal ? 'Update Goal' : 'Lock in Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
