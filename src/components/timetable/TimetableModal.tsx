import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { TimetableEvent, DayOfWeek, TaskCategory } from '../../types';
import { X, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: TimetableEvent | null;
  defaultDay?: DayOfWeek;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({
  isOpen,
  onClose,
  initialEvent,
  defaultDay = 'Monday',
}) => {
  const { addTimetableEvent, updateTimetableEvent, settings } = useTaskStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Study');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [roomOrLocation, setRoomOrLocation] = useState('');
  const [type, setType] = useState<TimetableEvent['type']>('Lecture');
  const [color, setColor] = useState('#06b6d4');
  const [isRecurring, setIsRecurring] = useState(true);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories: TaskCategory[] = ['Study', 'College', 'Work', 'Personal', 'Gym', 'Health', 'Finance', 'Coding'];
  const eventTypes: TimetableEvent['type'][] = ['Lecture', 'Lab', 'Deep Work', 'Workout', 'Study Session', 'Meeting', 'Break'];
  const colorOptions = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setCategory(initialEvent.category);
      setDayOfWeek(initialEvent.dayOfWeek);
      setStartTime(initialEvent.startTime);
      setEndTime(initialEvent.endTime);
      setRoomOrLocation(initialEvent.roomOrLocation || '');
      setType(initialEvent.type || 'Lecture');
      setColor(initialEvent.color || '#06b6d4');
      setIsRecurring(initialEvent.isRecurring);
    } else {
      setTitle('');
      setCategory('Study');
      setDayOfWeek(defaultDay);
      setStartTime('10:00');
      setEndTime('11:30');
      setRoomOrLocation('');
      setType('Lecture');
      setColor('#06b6d4');
      setIsRecurring(true);
    }
  }, [initialEvent, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);

    if (initialEvent) {
      updateTimetableEvent(initialEvent.id, {
        title,
        category,
        dayOfWeek,
        startTime,
        endTime,
        roomOrLocation,
        type,
        color,
        isRecurring,
      });
    } else {
      addTimetableEvent({
        title,
        category,
        dayOfWeek,
        startTime,
        endTime,
        roomOrLocation,
        type,
        color,
        isRecurring,
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950/95 backdrop-blur-2xl p-6 shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {initialEvent ? 'Edit Timetable Block' : 'Schedule Timetable Block'}
              </h2>
              <p className="text-xs text-slate-400">Block focused time on your master grid</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Subject / Session Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Consensus Systems"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Session Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TimetableEvent['type'])}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {eventTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location / Room</label>
              <input
                type="text"
                value={roomOrLocation}
                onChange={(e) => setRoomOrLocation(e.target.value)}
                placeholder="Hall 402 / Online"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Color Select */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Block Glow Theme</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Recurring checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-cyan-500"
              />
              <span>Repeats weekly on {dayOfWeek}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105"
            >
              {initialEvent ? 'Save Changes' : 'Add to Grid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
