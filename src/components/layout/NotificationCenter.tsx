import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Trophy,
  Clock,
  Sparkles,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const NotificationCenter: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    settings,
  } = useTaskStore();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'due':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'system':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md h-full bg-slate-950/95 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Notifications</h3>
                <p className="text-xs text-slate-400">
                  {notifications.filter((n) => !n.read).length} unread updates
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                markAllNotificationsRead();
              }}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>

            <button
              onClick={() => {
                if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                clearNotifications();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/50 mb-2" />
              <p className="text-sm font-semibold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No pending notifications at this moment.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  n.read
                    ? 'bg-white/5 border-white/5 opacity-70 hover:opacity-100'
                    : 'bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border-cyan-500/30 shadow-md shadow-cyan-950/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 font-mono">
            Powered by TaskVerse Neural Event Stream
          </p>
        </div>
      </div>
    </div>
  );
};
