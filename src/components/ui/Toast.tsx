import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useTaskStore();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
  };

  const getBorderGlow = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 shadow-emerald-500/20';
      case 'warning':
        return 'border-amber-500/40 shadow-amber-500/20';
      case 'error':
        return 'border-rose-500/40 shadow-rose-500/20';
      default:
        return 'border-cyan-500/40 shadow-cyan-500/20';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none select-none animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-950/90 backdrop-blur-2xl shadow-2xl ${getBorderGlow()} pointer-events-auto max-w-md`}
      >
        <div className="p-1 rounded-lg bg-white/5">{getIcon()}</div>
        <p className="text-xs font-semibold text-slate-100">{toast.message}</p>
      </div>
    </div>
  );
};
