import React from 'react';
import { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { Zap, Calendar, UserCheck, Trash2, CheckCircle, Clock } from 'lucide-react';

interface TaskMatrixViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskMatrixView: React.FC<TaskMatrixViewProps> = ({ tasks, onEditTask }) => {
  const { toggleTaskComplete } = useTaskStore();

  const q1 = tasks.filter((t) => t.priority === 'Critical' || (t.priority === 'High' && t.status !== 'Done'));
  const q2 = tasks.filter((t) => (t.priority === 'High' || t.priority === 'Medium') && !q1.includes(t));
  const q3 = tasks.filter((t) => t.priority === 'Low' && t.status !== 'Done');
  const q4 = tasks.filter((t) => t.status === 'Done' || (t.priority === 'Low' && !t.deadline));

  const quadrants = [
    {
      id: 'q1',
      title: 'Quadrant 1: Urgent & Critical',
      subtitle: 'Execute Immediately • High Impact',
      icon: Zap,
      color: 'from-rose-950/40 border-rose-500/30 text-rose-400',
      badge: 'DO FIRST',
      tasks: q1,
    },
    {
      id: 'q2',
      title: 'Quadrant 2: Strategic & Long-Term',
      subtitle: 'Schedule Deep Work • High Value',
      icon: Calendar,
      color: 'from-cyan-950/40 border-cyan-500/30 text-cyan-400',
      badge: 'SCHEDULE',
      tasks: q2,
    },
    {
      id: 'q3',
      title: 'Quadrant 3: Urgent Interruptions',
      subtitle: 'Delegate or Batch Process',
      icon: UserCheck,
      color: 'from-amber-950/40 border-amber-500/30 text-amber-400',
      badge: 'DELEGATE',
      tasks: q3,
    },
    {
      id: 'q4',
      title: 'Quadrant 4: Low Cognitive Utility',
      subtitle: 'Archive, Defer, or Eliminate',
      icon: Trash2,
      color: 'from-slate-900/60 border-slate-700/40 text-slate-400',
      badge: 'ELIMINATE',
      tasks: q4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quadrants.map((quad) => {
        const Icon = quad.icon;
        return (
          <div
            key={quad.id}
            className={`flex flex-col rounded-3xl border bg-gradient-to-b ${quad.color} to-slate-950/80 backdrop-blur-xl p-5 shadow-xl min-h-[300px]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white">{quad.title}</h3>
                  <p className="text-[10px] text-slate-400">{quad.subtitle}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white">
                {quad.badge} ({quad.tasks.length})
              </span>
            </div>

            {/* Task list */}
            <div className="flex-1 space-y-2 overflow-y-auto">
              {quad.tasks.length === 0 ? (
                <div className="h-36 flex items-center justify-center text-xs text-slate-500 font-mono">
                  No tasks currently in this quadrant
                </div>
              ) : (
                quad.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onEditTask(task)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-slate-950/60 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskComplete(task.id);
                        }}
                        className="cursor-pointer text-slate-400 hover:text-cyan-400"
                      >
                        <CheckCircle
                          className={`w-4 h-4 ${
                            task.status === 'Done' ? 'text-emerald-400 fill-emerald-400/20' : ''
                          }`}
                        />
                      </button>
                      <span
                        className={`text-xs font-semibold truncate ${
                          task.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      {task.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
