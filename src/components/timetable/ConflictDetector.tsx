import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const ConflictDetector: React.FC = () => {
  const { timetableConflicts, resolveConflictWithAI, settings } = useTaskStore();

  if (timetableConflicts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 backdrop-blur-xl p-4 shadow-xl mb-6 animate-in slide-in-from-top-2 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{timetableConflicts.length} Timetable Clashes Detected</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 text-[10px] font-mono">
                OVERLAP
              </span>
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              &quot;{timetableConflicts[0].event1.title}&quot; overlaps with &quot;
              {timetableConflicts[0].event2.title}&quot; on {timetableConflicts[0].event1.dayOfWeek} (
              {timetableConflicts[0].event1.startTime} - {timetableConflicts[0].event1.endTime}).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
            resolveConflictWithAI(timetableConflicts[0].event1.id, timetableConflicts[0].event2.id);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer hover:scale-105 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-Resolve Clash with AI</span>
        </button>
      </div>
    </div>
  );
};
