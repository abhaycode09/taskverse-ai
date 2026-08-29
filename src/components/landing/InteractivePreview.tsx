import React, { useState } from 'react';
import { useTaskStore, triggerConfetti } from '../../store/useTaskStore';
import {
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface InteractivePreviewProps {
  onGoToApp: () => void;
}

export const InteractivePreview: React.FC<InteractivePreviewProps> = ({ onGoToApp }) => {
  const { settings } = useTaskStore();

  const [previewTasks, setPreviewTasks] = useState([
    { id: 1, title: 'Finalize Quantum Neural Network paper', priority: 'Critical', done: false },
    { id: 2, title: 'Execute 90-min Deep Focus Sprint', priority: 'High', done: true },
    { id: 3, title: 'Daily 20m Transcendental Meditation', priority: 'Medium', done: false },
  ]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);

  const toggleTask = (id: number) => {
    if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
    triggerConfetti();
    setPreviewTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <section className="py-20 relative select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            TRY IT LIVE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-3">
            Interact Directly with the Engine
          </h2>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Click tasks below to trigger quantum audio chords and confetti, or test the deep focus timer.
          </p>
        </div>

        {/* Live Interactive Widget Card */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Live TaskVerse Simulation Node</h3>
                <p className="text-[11px] text-slate-400 font-mono">60 FPS Hardware-Accelerated Viewport</p>
              </div>
            </div>

            <button
              onClick={onGoToApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer hover:scale-105"
            >
              <span>Enter Full Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interactive Tasks */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
                Interactive Tasks (Click to Complete)
              </span>

              {previewTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    t.done
                      ? 'bg-slate-900/40 border-white/5 opacity-60'
                      : 'bg-slate-900/80 border-cyan-500/30 hover:border-cyan-400 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        t.done ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                      t.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Focus Timer */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                Deep Focus Engine
              </span>

              <div className="text-4xl font-black font-mono tracking-wider text-cyan-400 my-2">
                {timeStr}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => {
                    if (settings.enableSoundEffects) soundEngine.playClick(0.2);
                    setTimerRunning(!timerRunning);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerRunning ? 'Pause' : 'Start Focus'}</span>
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
