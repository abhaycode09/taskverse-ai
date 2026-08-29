import React, { useState } from 'react';
import { Task, Priority, TaskCategory } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import {
  CheckCircle,
  Circle,
  Pin,
  Star,
  MoreVertical,
  Clock,
  Calendar,
  AlertTriangle,
  Copy,
  Trash2,
  Edit2,
  CheckSquare,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface TaskListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onEditTask,
  selectedIds,
  setSelectedIds,
}) => {
  const {
    toggleTaskComplete,
    toggleTaskPin,
    toggleTaskStar,
    deleteTask,
    duplicateTask,
    settings,
  } = useTaskStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Low':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryColor = (cat: TaskCategory) => {
    switch (cat) {
      case 'Coding':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
      case 'Study':
      case 'College':
        return 'text-purple-400 bg-purple-950/40 border-purple-500/30';
      case 'Gym':
      case 'Health':
        return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
      case 'Work':
        return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
      case 'Finance':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center">
          <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-300">No tasks matching current filter</p>
          <p className="text-xs text-slate-500 mt-1">Adjust filters or create a new mission task</p>
        </div>
      ) : (
        tasks.map((task) => {
          const isDone = task.status === 'Done';
          const isSelected = selectedIds.includes(task.id);
          const subtaskCount = task.subtasks.length;
          const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

          return (
            <div
              key={task.id}
              className={`group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                  : isDone
                  ? 'bg-slate-900/30 border-white/5 opacity-60 hover:opacity-100'
                  : task.isPinned
                  ? 'bg-gradient-to-r from-slate-900/90 to-cyan-950/30 border-cyan-500/30 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900/80 shadow-md'
              }`}
            >
              {/* Left Section: Checkbox, Status & Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Bulk Select Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectOne(task.id)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 cursor-pointer hidden sm:inline"
                />

                {/* Complete Toggle Button */}
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="cursor-pointer text-slate-400 hover:text-cyan-400 transition-transform active:scale-90 shrink-0"
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-cyan-400" />
                  )}
                </button>

                {/* Task Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => onEditTask(task)}
                      className={`text-xs font-bold truncate cursor-pointer hover:text-cyan-300 transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Category Chip */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryColor(
                        task.category
                      )}`}
                    >
                      {task.category}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityBadge(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Subtitle / Description / Subtasks Progress */}
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 flex-wrap">
                    {task.description && (
                      <span className="truncate max-w-xs">{task.description}</span>
                    )}

                    {subtaskCount > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                        <CheckSquare className="w-3 h-3" />
                        {completedSubtasks}/{subtaskCount} Subtasks
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {task.deadline} {task.dueTime && `@ ${task.dueTime}`}
                    </span>

                    {task.estimatedDuration && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.estimatedDuration}m
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section: Pin, Star & Actions Menu */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Pin Button */}
                <button
                  onClick={() => toggleTaskPin(task.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    task.isPinned
                      ? 'text-cyan-400 bg-cyan-500/20'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                  title="Pin to top"
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                {/* Star Button */}
                <button
                  onClick={() => toggleTaskStar(task.id)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    task.isStarred
                      ? 'text-amber-400 bg-amber-500/20 fill-amber-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                  title="Star important"
                >
                  <Star className={`w-3.5 h-3.5 ${task.isStarred ? 'fill-amber-400' : ''}`} />
                </button>

                {/* Quick Edit */}
                <button
                  onClick={() => onEditTask(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* More Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuId((prev) => (prev === task.id ? null : task.id))
                    }
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {activeMenuId === task.id && (
                    <div
                      className="absolute right-0 mt-1 w-36 rounded-xl border border-white/15 bg-slate-950/95 backdrop-blur-xl p-1 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100"
                      onMouseLeave={() => setActiveMenuId(null)}
                    >
                      <button
                        onClick={() => {
                          duplicateTask(task.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Duplicate
                      </button>

                      <button
                        onClick={() => {
                          deleteTask(task.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
