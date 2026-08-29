import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task, TaskCategory, Priority, TaskStatus } from '../../types';
import { TaskListView } from './TaskListView';
import { TaskKanbanView } from './TaskKanbanView';
import { TaskMatrixView } from './TaskMatrixView';
import { TaskGanttView } from './TaskGanttView';
import { TaskQuickAdd } from './TaskQuickAdd';
import { TaskModal } from './TaskModal';
import {
  List,
  Kanban,
  Grid2X2,
  GitCommit,
  Plus,
  Filter,
  Search,
  CheckCheck,
  Trash2,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { soundEngine } from '../../store/soundEffects';

export const TaskManager: React.FC = () => {
  const {
    tasks,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedPriorityFilter,
    setSelectedPriorityFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    searchQuery,
    setSearchQuery,
    bulkCompleteTasks,
    bulkDeleteTasks,
    settings,
  } = useTaskStore();

  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'matrix' | 'gantt'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categories: (TaskCategory | 'All')[] = [
    'All',
    'Coding',
    'Study',
    'College',
    'Work',
    'Gym',
    'Health',
    'Finance',
    'Personal',
    'Shopping',
  ];

  const views = [
    { id: 'list', label: 'List View', icon: List },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'matrix', label: 'Priority Matrix', icon: Grid2X2 },
    { id: 'gantt', label: 'Timeline Gantt', icon: GitCommit },
  ] as const;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Category
      if (selectedCategoryFilter !== 'All' && t.category !== selectedCategoryFilter) return false;
      // Priority
      if (selectedPriorityFilter !== 'All' && t.priority !== selectedPriorityFilter) return false;
      // Status
      if (selectedStatusFilter !== 'All' && t.status !== selectedStatusFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  }, [tasks, selectedCategoryFilter, selectedPriorityFilter, selectedStatusFilter, searchQuery]);

  const handleOpenNew = (status: TaskStatus = 'Todo') => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Daily Mission Control</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {filteredTasks.length} Active Tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            High-density task tracking, priority workflows, and automated scheduling
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  if (settings.enableSoundEffects) soundEngine.playClick(0.15);
                  setCurrentView(v.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smart NLP Quick Add Input Bar */}
      <TaskQuickAdd />

      {/* Search, Categories, and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, descriptions, tags..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Priority & Status Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value as Priority | 'All')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as TaskStatus | 'All')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
              <option value="Backlog">Backlog</option>
            </select>

            <button
              onClick={() => handleOpenNew()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Action Toolbar if items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <span className="text-xs font-bold text-cyan-300">
            {selectedIds.length} tasks selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                bulkCompleteTasks(selectedIds);
                setSelectedIds([]);
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark Done
            </button>

            <button
              onClick={() => {
                bulkDeleteTasks(selectedIds);
                setSelectedIds([]);
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {currentView === 'list' && (
        <TaskListView
          tasks={filteredTasks}
          onEditTask={handleEdit}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      )}
      {currentView === 'kanban' && (
        <TaskKanbanView
          tasks={filteredTasks}
          onEditTask={handleEdit}
          onAddNewWithStatus={(st) => handleOpenNew(st)}
        />
      )}
      {currentView === 'matrix' && (
        <TaskMatrixView tasks={filteredTasks} onEditTask={handleEdit} />
      )}
      {currentView === 'gantt' && (
        <TaskGanttView tasks={filteredTasks} onEditTask={handleEdit} />
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />
    </div>
  );
};
