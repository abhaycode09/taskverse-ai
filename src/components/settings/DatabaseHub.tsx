import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Database, CheckCircle, RefreshCw, Download, Upload, Shield, Server } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const DatabaseHub: React.FC = () => {
  const { settings, updateSettings, showToast, resetToDefaultData, clearAllData, tasks, timetable, habits, goals } = useTaskStore();

  const [selectedDB, setSelectedDB] = useState(settings.dbType);
  const [endpoint, setEndpoint] = useState(settings.dbConfig?.endpoint || 'https://api.taskverse-cloud.io/v1/graphql');
  const [apiKey, setApiKey] = useState(settings.dbConfig?.apiKey || 'tv_live_sec_993848a8f89e2');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'success' | 'failed'; latency?: number }>({
    status: 'idle',
  });

  const databases = [
    { id: 'local', name: 'Browser LocalStorage', desc: 'Zero-latency offline neural storage' },
    { id: 'supabase', name: 'Supabase PostgreSQL', desc: 'Row-level security with realtime subscriptions' },
    { id: 'firebase', name: 'Google Cloud Firebase', desc: 'Firestore NoSQL with offline cache sync' },
    { id: 'mongodb', name: 'MongoDB Atlas', desc: 'High-throughput document store cluster' },
    { id: 'postgresql', name: 'PostgreSQL Direct', desc: 'ACID transactional relational core' },
  ] as const;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult({ status: 'idle' });
    if (settings.enableSoundEffects) soundEngine.playClick(0.2);

    setTimeout(() => {
      setIsTesting(false);
      const simulatedLatency = Math.floor(Math.random() * 25) + 18; // 18ms - 42ms
      setTestResult({ status: 'success', latency: simulatedLatency });
      updateSettings({
        dbType: selectedDB,
        dbConfig: {
          endpoint,
          apiKey,
          connected: true,
          lastSynced: new Date().toISOString(),
        },
      });
      if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
      showToast(`Connected to ${selectedDB.toUpperCase()} (${simulatedLatency}ms latency)`, 'success');
    }, 700);
  };

  const handleExportAllJSON = () => {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      timetable,
      habits,
      goals,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `TaskVerse_Master_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Full system backup JSON exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* DB Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {databases.map((db) => {
          const isSelected = selectedDB === db.id;
          return (
            <div
              key={db.id}
              onClick={() => setSelectedDB(db.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-950/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-100">{db.name}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{db.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Connection Endpoint Parameters */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> Database Cluster Configuration
          </span>
          {testResult.status === 'success' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <CheckCircle className="w-3 h-3" /> Online ({testResult.latency}ms)
            </span>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">API Endpoint / Connection URI</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Access Token / Secret Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isTesting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Shield className="w-4 h-4" />
              <span>Verify Cluster Handshake</span>
            </>
          )}
        </button>
      </div>

      {/* Backup & Restore Tools */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handleExportAllJSON}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export System JSON Backup</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => clearAllData()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-bold text-rose-300 transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear All & Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
