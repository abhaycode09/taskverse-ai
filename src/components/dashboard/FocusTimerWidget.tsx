import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Play, Pause, RotateCcw, Volume2, CloudRain, Disc, Radio, Wind, Sparkles } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const FocusTimerWidget: React.FC = () => {
  const {
    focusState,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    setFocusMode,
    setAmbientSound,
    settings,
  } = useTaskStore();

  const minutes = Math.floor(focusState.timeLeft / 60);
  const seconds = focusState.timeLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress =
    focusState.initialDuration > 0
      ? ((focusState.initialDuration - focusState.timeLeft) / focusState.initialDuration) * 100
      : 0;

  const ambientSounds = [
    { id: 'none', label: 'Mute', icon: Wind },
    { id: 'rain', label: 'Rain', icon: CloudRain },
    { id: 'space', label: 'Space', icon: Disc },
    { id: 'lofi', label: 'Lo-Fi', icon: Radio },
    { id: 'whitenoise', label: 'White', icon: Volume2 },
  ] as const;

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 via-slate-900/80 to-slate-950/90 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Quantum Deep Focus</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Session #{focusState.sessionsCompleted + 1}
            </p>
          </div>
        </div>

        {/* Mode Switchers */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-semibold">
          <button
            onClick={() => setFocusMode('pomodoro')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              focusState.mode === 'pomodoro'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => setFocusMode('shortBreak')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              focusState.mode === 'shortBreak'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Break
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="my-6 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-300 shadow-[0_0_15px_#06b6d4]"
            />
          </svg>

          <div className="absolute text-center">
            <span className="text-3xl font-black font-mono tracking-wider text-white">
              {timeDisplay}
            </span>
            <span className="block text-[9px] uppercase font-mono text-cyan-400 mt-1 tracking-widest">
              {focusState.isRunning ? 'FLOW ACTIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {focusState.isRunning ? (
          <button
            onClick={pauseFocusTimer}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer hover:scale-105"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button
            onClick={startFocusTimer}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer hover:scale-105"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Start Sprint
          </button>
        )}

        <button
          onClick={resetFocusTimer}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Generative Ambient Soundscape Bar */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2 text-[10px] text-slate-400 font-mono">
          <span>Ambient Sound Generator</span>
          <span className="text-cyan-400 uppercase font-bold">{focusState.ambientSound}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {ambientSounds.map((sound) => {
            const Icon = sound.icon;
            const isSelected = focusState.ambientSound === sound.id;

            return (
              <button
                key={sound.id}
                onClick={() => setAmbientSound(sound.id)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 mb-1" />
                <span className="truncate">{sound.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
