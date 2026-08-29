import React from 'react';
import { Task, TaskStatus } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { Plus, CheckCircle, Clock, Star, Pin } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface TaskKanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddNewWithStatus: (status: TaskStatus) => void;
}

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onEditTask,
  onAddNewWithStatus,
}) => {
  const { updateTask, toggleTaskComplete, settings } = useTaskStore();

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'Backlog', title: 'Backlog Queue', color: 'border-slate-600/40 text-slate-400' },
    { id: 'Todo', title: 'Ready to Execute', color: 'border-blue-500/40 text-blue-400' },
    { id: 'In Progress', title: 'Active Sprint', color: 'border-cyan-500/40 text-cyan-400' },
    { id: 'In Review', title: 'Validation', color: 'border-purple-500/40 text-purple-400' },
    { id: 'Done', title: 'Accomplished', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      if (settings.enableSoundEffects) soundEngine.playClick(0.15);
      updateTask(taskId, { status });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-3 min-h-[520px] shadow-lg"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-current ${col.color}`} />
                <h4 className="text-xs font-bold text-slate-200">{col.title}</h4>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/10 text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onAddNewWithStatus(col.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks Card List */}
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                  }}
                  onClick={() => onEditTask(task)}
                  className="group relative p-3 rounded-xl border border-white/10 bg-slate-950/70 hover:border-cyan-500/40 hover:bg-slate-900/90 shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {task.title}
                    </span>
                    {task.isStarred && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                    )}
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                      {task.category}
                    </span>

                    <span className="flex items-center gap-1 font-mono text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {task.estimatedDuration}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
