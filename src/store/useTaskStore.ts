import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  Task,
  TimetableEvent,
  Habit,
  Goal,
  ProductivityMetric,
  UserAchievement,
  UserProfile,
  AppSettings,
  NotificationItem,
  Priority,
  TaskCategory,
  TaskStatus,
} from '../types';
import {
  initialTasks,
  initialTimetable,
  initialHabits,
  initialGoals,
  initialProductivityHistory,
  initialAchievements,
  initialProfile,
  initialSettings,
  initialNotifications,
} from './initialData';
import { soundEngine } from './soundEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'taskverse_ai_state_v1';

export interface StoreContextType {
  // Navigation & View
  activePage: 'landing' | 'dashboard' | 'tasks' | 'timetable' | 'habits' | 'goals' | 'analytics' | 'settings';
  setActivePage: (page: 'landing' | 'dashboard' | 'tasks' | 'timetable' | 'habits' | 'goals' | 'analytics' | 'settings') => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: TaskCategory | 'All';
  setSelectedCategoryFilter: (cat: TaskCategory | 'All') => void;
  selectedPriorityFilter: Priority | 'All';
  setSelectedPriorityFilter: (pri: Priority | 'All') => void;
  selectedStatusFilter: TaskStatus | 'All';
  setSelectedStatusFilter: (status: TaskStatus | 'All') => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  toggleTaskPin: (id: string) => void;
  toggleTaskStar: (id: string) => void;
  toggleTaskArchive: (id: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  bulkDeleteTasks: (ids: string[]) => void;
  bulkCompleteTasks: (ids: string[]) => void;
  bulkUpdateCategory: (ids: string[], category: TaskCategory) => void;

  // Timetable
  timetable: TimetableEvent[];
  addTimetableEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  updateTimetableEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  deleteTimetableEvent: (id: string) => void;
  timetableConflicts: { event1: TimetableEvent; event2: TimetableEvent }[];
  resolveConflictWithAI: (event1Id: string, event2Id: string) => void;
  loadTimetableTemplate: (templateName: 'college' | 'work' | 'intense') => void;

  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (id: string, dateStr: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'isCompleted' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  // Focus Timer
  focusState: {
    isRunning: boolean;
    timeLeft: number; // seconds
    initialDuration: number; // seconds
    mode: 'pomodoro' | 'shortBreak' | 'longBreak';
    sessionsCompleted: number;
    ambientSound: 'none' | 'rain' | 'space' | 'lofi' | 'whitenoise';
  };
  startFocusTimer: () => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  setFocusMode: (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => void;
  setAmbientSound: (sound: 'none' | 'rain' | 'space' | 'lofi' | 'whitenoise') => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  clearNotifications: () => void;

  // Analytics & Achievements
  metrics: ProductivityMetric[];
  achievements: UserAchievement[];
  profile: UserProfile;
  addXP: (amount: number, reason?: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetToDefaultData: () => void;
  clearAllData: () => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error'; id: number } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useTaskStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useTaskStore must be used within a TaskStoreProvider');
  }
  return context;
};

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
  });
}
