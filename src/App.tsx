import React, { useState } from 'react';
import { TaskStoreProvider } from './store/TaskStoreProvider';
import { useTaskStore } from './store/useTaskStore';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { NotificationCenter } from './components/layout/NotificationCenter';
import { AuthModal } from './components/auth/AuthModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { Toast } from './components/ui/Toast';
import { TaskModal } from './components/tasks/TaskModal';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TaskManager } from './components/tasks/TaskManager';
import { TimetableCreator } from './components/timetable/TimetableCreator';
import { HabitTracker } from './components/habits/HabitTracker';
import { GoalManager } from './components/goals/GoalManager';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { Task } from './types';

const MainAppContent: React.FC = () => {
  const { activePage } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenTaskDetail = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Ambient Background with Aurora Glows & Particles */}
      <AmbientBackground />

      {/* Global Navbar */}
      <Navbar onOpenTaskModal={handleOpenNewTask} />

      {/* Main Workspace Layout */}
      {activePage === 'landing' ? (
        <main className="flex-1 relative z-10">
          <LandingPage />
        </main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 flex gap-6 relative z-10 mt-2">
          {/* Collapsible Sleek Sidebar */}
          <Sidebar />

          {/* Page Content Viewport */}
          <main className="flex-1 min-w-0">
            {activePage === 'dashboard' && (
              <DashboardOverview
                onOpenTaskModal={handleOpenNewTask}
                onOpenTaskDetail={handleOpenTaskDetail}
              />
            )}
            {activePage === 'tasks' && <TaskManager />}
            {activePage === 'timetable' && <TimetableCreator />}
            {activePage === 'habits' && <HabitTracker />}
            {activePage === 'goals' && <GoalManager />}
            {activePage === 'analytics' && <AnalyticsDashboard />}
            {activePage === 'settings' && <SettingsModal />}
          </main>
        </div>
      )}

      {/* Global Interactive Overlays & Modals */}
      <CommandPalette onOpenTaskModal={handleOpenNewTask} />
      <NotificationCenter />
      <AuthModal />
      <AIAssistantModal />
      <Toast />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />
    </div>
  );
};

export default function App() {
  return (
    <TaskStoreProvider>
      <MainAppContent />
    </TaskStoreProvider>
  );
}
