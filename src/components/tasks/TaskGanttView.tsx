import React from 'react';
import { Task } from '../../types';
import { Clock, Calendar, CheckSquare } from 'lucide-react';

interface TaskGanttViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskGanttView: React.FC<TaskGanttViewProps> = ({ tasks, onEditTask }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div>
          <h3 className="text-sm font-extrabold text-white">Quantum Timeline & Execution Flow</h3>
          <p className="text-xs text-slate-400">Chronological sprint mapping and estimated duration load</p>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
          {tasks.length} Tracked Nodes
        </span>
      </div>

      <div className="space-y-4 overflow-x-auto">
        {tasks.map((task, idx) => {
          // Duration bar width representation
          const duration = task.estimatedDuration || 60;
          const widthPercent = Math.min(100, Math.max(15, (duration / 120) * 100));

          return (
            <div
              key={task.id}
              onClick={() => onEditTask(task)}
              className="flex items-center gap-4 group cursor-pointer"
            >
              {/* Task Title & Label */}
              <div className="w-56 shrink-0 text-left">
                <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                  {task.title}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {task.deadline} • {task.category}
                </p>
              </div>

              {/* Gantt Bar Track */}
              <div className="flex-1 h-8 rounded-xl bg-slate-950/60 border border-white/5 relative flex items-center p-1 overflow-hidden">
                <div
                  className={`h-full rounded-lg flex items-center justify-between px-3 text-[10px] font-bold text-white transition-all duration-300 ${
                    task.status === 'Done'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 opacity-70'
                      : task.priority === 'Critical'
                      ? 'bg-gradient-to-r from-rose-600 to-red-500'
                      : task.priority === 'High'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                  }`}
                  style={{
                    width: `${widthPercent}%`,
                    marginLeft: `${(idx * 4) % 30}%`,
                  }}
                >
                  <span className="truncate">{task.estimatedDuration} mins</span>
                  <span className="font-mono text-[9px] uppercase">{task.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
