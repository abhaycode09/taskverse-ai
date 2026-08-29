import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Priority, TaskCategory } from '../../types';
import { Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const TaskQuickAdd: React.FC = () => {
  const { addTask, settings, showToast } = useTaskStore();
  const [input, setInput] = useState('');

  const parseAndAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let text = input.trim();
    let priority: Priority = 'Medium';
    let category: TaskCategory = 'Coding';
    let duration = 45;
    let deadline = new Date().toISOString().split('T')[0];
    const tags: string[] = [];

    // Parse !Priority
    if (text.includes('!critical') || text.includes('!Critical')) {
      priority = 'Critical';
      text = text.replace(/!critical/gi, '');
    } else if (text.includes('!high') || text.includes('!High')) {
      priority = 'High';
      text = text.replace(/!high/gi, '');
    } else if (text.includes('!low') || text.includes('!Low')) {
      priority = 'Low';
      text = text.replace(/!low/gi, '');
    }

    // Parse #Category
    const categoryMatches: Record<string, TaskCategory> = {
      '#study': 'Study',
      '#college': 'College',
      '#work': 'Work',
      '#gym': 'Gym',
      '#health': 'Health',
      '#finance': 'Finance',
      '#coding': 'Coding',
      '#shopping': 'Shopping',
      '#personal': 'Personal',
    };

    for (const [tag, cat] of Object.entries(categoryMatches)) {
      if (text.toLowerCase().includes(tag)) {
        category = cat;
        tags.push(cat);
        text = text.replace(new RegExp(tag, 'gi'), '');
      }
    }

    // Parse ~Duration (e.g. ~30m, ~60m)
    const durMatch = text.match(/~(\d+)m?/);
    if (durMatch) {
      duration = parseInt(durMatch[1], 10);
      text = text.replace(durMatch[0], '');
    }

    // Parse "tomorrow"
    if (text.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deadline = tomorrow.toISOString().split('T')[0];
      text = text.replace(/tomorrow/gi, '');
    }

    const cleanTitle = text.trim();
    if (!cleanTitle) return;

    if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);

    addTask({
      title: cleanTitle,
      description: 'Quick-captured via Quantum NLP Parser',
      priority,
      category,
      deadline,
      dueTime: '18:00',
      estimatedDuration: duration,
      tags: tags.length ? tags : ['QuickTask'],
      status: 'Todo',
      subtasks: [],
    });

    setInput('');
  };

  return (
    <div className="relative mb-6">
      <form
        onSubmit={parseAndAddTask}
        className="relative flex items-center rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl shadow-xl shadow-cyan-950/30 p-1.5 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-cyan-500/20"
      >
        <div className="flex items-center justify-center pl-3 pr-2 text-cyan-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Quick add task with NLP (e.g. "Review quantum circuit slides tomorrow 5pm !High #College ~60m")'
          className="flex-1 bg-transparent py-2 px-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />

        <div className="flex items-center gap-2 pr-1.5">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
            <span>Enter</span>
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>

          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all cursor-pointer disabled:opacity-30 hover:scale-105"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
