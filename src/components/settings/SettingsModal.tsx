import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { ThemeMode, AccentColor } from '../../types';
import { DatabaseHub } from './DatabaseHub';
import {
  Settings,
  Palette,
  Sliders,
  Database,
  Volume2,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  User,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, profile, showToast } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'appearance' | 'audio' | 'database' | 'profile'>('appearance');

  const themes: { id: ThemeMode; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dark', name: 'Quantum Dark', icon: Moon },
    { id: 'light', name: 'Apple Frost Light', icon: Sun },
    { id: 'matrix', name: 'Cyber Matrix', icon: Monitor },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', icon: Sparkles },
    { id: 'midnight-oled', name: 'Midnight OLED', icon: Moon },
  ];

  const accents: { id: AccentColor; name: string; hex: string }[] = [
    { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4' },
    { id: 'purple', name: 'Cyber Purple', hex: '#a855f7' },
    { id: 'emerald', name: 'Neon Emerald', hex: '#10b981' },
    { id: 'amber', name: 'Solar Amber', hex: '#f59e0b' },
    { id: 'rose', name: 'Rose Quartz', hex: '#f43f5e' },
    { id: 'sapphire', name: 'Deep Sapphire', hex: '#3b82f6' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tight text-white">System Settings & Engine</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Control Center
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Customize visual fidelity, audio haptics, theme engines, and cloud databases
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'appearance', label: 'Appearance & UI', icon: Palette },
          { id: 'audio', label: 'Audio & Haptics', icon: Volume2 },
          { id: 'database', label: 'Database & Cloud Hub', icon: Database },
          { id: 'profile', label: 'User Profile & Rank', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Appearance */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Theme Modes */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
              Theme Engine
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {themes.map((th) => {
                const Icon = th.icon;
                const isSelected = settings.theme === th.id;

                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                      updateSettings({ theme: th.id });
                    }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-950/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-cyan-400' : ''}`} />
                    <span className="text-xs font-bold text-center">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Colors */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
              Neon Glow Accent Color
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {accents.map((acc) => {
                const isSelected = settings.accent === acc.id;

                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                      updateSettings({ accent: acc.id });
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white/30 text-white ring-2 ring-white/20'
                        : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: acc.hex }}
                    />
                    <span className="text-xs font-bold truncate">{acc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Graphic & Motion Fidelity Toggles */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
              Visual Rendering & GPU Effects
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'enable3D',
                  title: 'Interactive 3D Three.js Hologram',
                  desc: 'Render interactive 3D particle sphere and floating cubes',
                  checked: settings.enable3D,
                  toggle: () => updateSettings({ enable3D: !settings.enable3D }),
                },
                {
                  id: 'enableParticles',
                  title: 'Floating Cosmic Particles Canvas',
                  desc: 'Dynamic ambient stars and mouse tracking light glow',
                  checked: settings.enableParticles,
                  toggle: () => updateSettings({ enableParticles: !settings.enableParticles }),
                },
                {
                  id: 'ambientLighting',
                  title: 'Aurora Mesh Lighting',
                  desc: 'Soft animated blur background mesh gradients',
                  checked: settings.ambientLighting,
                  toggle: () => updateSettings({ ambientLighting: !settings.ambientLighting }),
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-slate-950/60"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={item.toggle}
                    className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      item.checked ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                        item.checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Audio */}
      {activeTab === 'audio' && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                Web Audio Synthesizer Haptics
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Satisfying UI chords on task completion, level up fanfares, and Pomodoro bells
              </p>
            </div>
            <button
              onClick={() => updateSettings({ enableSoundEffects: !settings.enableSoundEffects })}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                settings.enableSoundEffects ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.enableSoundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Test Sound triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => soundEngine.playSuccess(0.25)}
              className="p-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              🎵 Test Success Chord
            </button>

            <button
              onClick={() => soundEngine.playLevelUp(0.3)}
              className="p-3 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              ⚡ Test Level Up Fanfare
            </button>

            <button
              onClick={() => soundEngine.playBell(0.3)}
              className="p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
            >
              🔔 Test Focus Bell
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Database Hub */}
      {activeTab === 'database' && <DatabaseHub />}

      {/* Tab 4: Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-lg shadow-cyan-500/30"
            />
            <div>
              <h3 className="text-base font-extrabold text-white">{profile.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{profile.email}</p>
              <p className="text-xs text-cyan-400 font-bold mt-1">{profile.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Current Rank</span>
              <p className="text-sm font-black text-white mt-1">{profile.levelTitle}</p>
              <p className="text-[10px] text-cyan-400 font-mono">Level {profile.level}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Total XP Amassed</span>
              <p className="text-sm font-black text-amber-400 font-mono mt-1">{profile.xp} XP</p>
              <p className="text-[10px] text-slate-400 font-mono">Multiplier: 1.5x</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Lifetime Focus</span>
              <p className="text-sm font-black text-purple-400 font-mono mt-1">
                {profile.totalFocusHours} hrs
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {profile.totalTasksCompleted} tasks done
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
