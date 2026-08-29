import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Flame, Sparkles } from 'lucide-react';

export const HeatmapWidget: React.FC = () => {
  const { metrics, profile } = useTaskStore();

  // Generate 28 days (4 weeks) simulation
  const weeks = [0, 1, 2, 3];
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getIntensityClass = (score: number) => {
    if (score >= 90) return 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]';
    if (score >= 75) return 'bg-cyan-500/80';
    if (score >= 50) return 'bg-cyan-600/50';
    if (score > 0) return 'bg-cyan-800/30';
    return 'bg-slate-800/40';
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <h3 className="text-xs font-black text-white">Execution Heatmap Matrix</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">
          Streak: {profile.streakDays} Consecutive Days
        </span>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day, idx) => (
            <span
              key={idx}
              className="text-center text-[10px] font-mono font-bold text-slate-500"
            >
              {day}
            </span>
          ))}
        </div>

        {weeks.map((weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const totalDayIndex = weekIdx * 7 + dayIdx;
              const pseudoScore =
                totalDayIndex > 20
                  ? 94
                  : totalDayIndex > 14
                  ? 88
                  : totalDayIndex > 7
                  ? 76
                  : (totalDayIndex * 13) % 100;

              return (
                <div
                  key={dayIdx}
                  title={`Day ${totalDayIndex + 1}: ${pseudoScore}% Productivity Score`}
                  className={`h-7 rounded-lg transition-all duration-200 hover:scale-110 cursor-pointer ${getIntensityClass(
                    pseudoScore
                  )}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 text-[10px] text-slate-400 font-mono">
        <span>Less Output</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-slate-800/40" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-800/30" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-600/50" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-500/80" />
          <span className="w-2.5 h-2.5 rounded bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
        </div>
        <span>Peak Flow</span>
      </div>
    </div>
  );
};
