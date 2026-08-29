import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { TimetableEvent, DayOfWeek } from '../../types';
import { TimetableModal } from './TimetableModal';
import { ConflictDetector } from './ConflictDetector';
import { TimetableExport } from './TimetableExport';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const TimetableCreator: React.FC = () => {
  const { timetable, deleteTimetableEvent, loadTimetableTemplate, settings } = useTaskStore();

  const [currentView, setCurrentView] = useState<'week' | 'today' | 'month'>('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<DayOfWeek>('Monday');

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 17 }, (_, i) => i + 7); // 7 AM to 11 PM

  const handleOpenAdd = (day: DayOfWeek) => {
    setSelectedDayForAdd(day);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ev: TimetableEvent) => {
    setEditingEvent(ev);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Smart Timetable Creator</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {timetable.length} Scheduled Blocks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Time-blocking architecture with AI conflict resolution & calendar sync
          </p>
        </div>

        {/* Action Controls & Templates */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Preset templates */}
          <div className="flex items-center gap-1 p-1 rounded-2xl border border-white/10 bg-slate-900/80">
            <button
              onClick={() => loadTimetableTemplate('college')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              College
            </button>
            <button
              onClick={() => loadTimetableTemplate('work')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Work
            </button>
            <button
              onClick={() => loadTimetableTemplate('intense')}
              className="px-2.5 py-1 rounded-xl text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              Sprint
            </button>
          </div>

          <TimetableExport />

          <button
            onClick={() => handleOpenAdd('Monday')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Block Time</span>
          </button>
        </div>
      </div>

      {/* Conflict Alert Banner */}
      <ConflictDetector />

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-slate-900/60">
          <button
            onClick={() => setCurrentView('week')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'week' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Grid
          </button>
          <button
            onClick={() => setCurrentView('today')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'today' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Today&apos;s Focus
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          Time Slot Grid: 07:00 — 23:00
        </span>
      </div>

      {/* Weekly Grid View */}
      {currentView === 'week' && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[840px]">
            {days.map((day) => {
              const dayEvents = timetable
                .filter((e) => e.dayOfWeek === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              const isToday = day === 'Saturday'; // Demo represents Saturday

              return (
                <div
                  key={day}
                  className={`flex flex-col rounded-2xl border p-3 min-h-[480px] transition-all duration-200 ${
                    isToday
                      ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-950/90 border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-white/5'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                    <div>
                      <h3
                        className={`text-xs font-black tracking-tight ${
                          isToday ? 'text-cyan-300' : 'text-slate-200'
                        }`}
                      >
                        {day}
                      </h3>
                      {isToday && (
                        <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                          TODAY
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenAdd(day)}
                      className="p-1 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title={`Add schedule block on ${day}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Events in Day */}
                  <div className="space-y-2.5 flex-1">
                    {dayEvents.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-600 text-[10px] font-mono">
                        Free Horizon
                      </div>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => handleEdit(ev)}
                          className="group relative p-3 rounded-xl border border-white/10 bg-slate-900/90 hover:border-cyan-500/40 shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                          style={{
                            borderLeftWidth: '3px',
                            borderLeftColor: ev.color || '#06b6d4',
                          }}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                              {ev.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 mb-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>
                              {ev.startTime} - {ev.endTime}
                            </span>
                          </div>

                          {ev.roomOrLocation && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{ev.roomOrLocation}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[9px] font-mono text-slate-400">
                            <span className="uppercase">{ev.type || 'Session'}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (settings.enableSoundEffects) soundEngine.playClick(0.1);
                                deleteTimetableEvent(ev.id);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-0.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's Focus View */}
      {currentView === 'today' && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
          <h3 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Today&apos;s Linear Schedule Timeline (Saturday)
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-purple-500 before:to-emerald-500">
            {timetable
              .filter((e) => e.dayOfWeek === 'Saturday')
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => handleEdit(ev)}
                  className="relative flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-slate-950/80 hover:border-cyan-500/40 shadow-xl transition-all cursor-pointer group"
                >
                  <span className="absolute -left-[23px] top-6 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-slate-950" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white group-hover:text-cyan-300">
                        {ev.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {ev.type || 'Deep Work'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                      <span>{ev.startTime} — {ev.endTime}</span>
                      {ev.roomOrLocation && <span>• {ev.roomOrLocation}</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-bold text-slate-300 uppercase">
                      {ev.category}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <TimetableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        initialEvent={editingEvent}
        defaultDay={selectedDayForAdd}
      />
    </div>
  );
};
