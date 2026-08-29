import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const ScheduleWidget: React.FC = () => {
  const { timetable, setActivePage } = useTaskStore();

  const todayEvents = timetable
    .filter((e) => e.dayOfWeek === 'Saturday')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <h3 className="text-xs font-black text-white">Today&apos;s Timetable Schedule</h3>
          </div>
          <button
            onClick={() => setActivePage('timetable')}
            className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
          >
            <span>Open Grid</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {todayEvents.length === 0 ? (
            <div className="h-36 flex items-center justify-center text-xs text-slate-500 font-mono">
              No calendar commitments scheduled for today
            </div>
          ) : (
            todayEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => setActivePage('timetable')}
                className="group flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/60 hover:border-purple-500/40 hover:bg-slate-900/80 transition-all cursor-pointer"
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor: ev.color || '#8b5cf6',
                }}
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors truncate">
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {ev.roomOrLocation || 'TaskVerse Room'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 font-mono text-[10px] text-cyan-300 shrink-0">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{ev.startTime} - {ev.endTime}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>Master Sync Status</span>
        <span className="text-emerald-400 font-bold">0 Clashes</span>
      </div>
    </div>
  );
};
