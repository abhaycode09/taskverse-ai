import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types';
import { CheckCircle2, Circle, Clock, ArrowRight, Plus } from 'lucide-react';

interface QuickTasksWidgetProps {
  onOpenTaskModal: () => void;
  onOpenTaskDetail: (task: Task) => void;
}

export const QuickTasksWidget: React.FC<QuickTasksWidgetProps> = ({
  onOpenTaskModal,
  onOpenTaskDetail,
}) => {
  const { tasks, toggleTaskComplete, setActivePage } = useTaskStore();

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'Done')
    .slice(0, 5);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-xs font-black text-white">Upcoming Mission Tasks</h3>
          </div>
          <button
            onClick={() => setActivePage('tasks')}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {upcomingTasks.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
              All prioritized tasks accomplished!
            </div>
          ) : (
            upcomingTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onOpenTaskDetail(task)}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-950/60 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskComplete(task.id);
                    }}
                    className="text-slate-400 hover:text-cyan-400 shrink-0"
                  >
                    <Circle className="w-4 h-4 hover:text-cyan-400" />
                  </button>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      task.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : task.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={onOpenTaskModal}
        className="w-full flex items-center justify-center gap-1.5 py-2 mt-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer border border-white/5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Quick Add Task</span>
      </button>
    </div>
  );
};
