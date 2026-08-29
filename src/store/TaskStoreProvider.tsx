import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { StoreContext, StoreContextType, triggerConfetti } from './useTaskStore';
import { soundEngine } from './soundEffects';

const STORAGE_KEY = 'taskverse_ai_v3_clean_store';

export const TaskStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Modals
  const [activePage, setActivePage] = useState<StoreContextType['activePage']>('landing');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<TaskCategory | 'All'>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<Priority | 'All'>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<TaskStatus | 'All'>('All');

  // Load Initial Saved State or Defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [timetable, setTimetable] = useState<TimetableEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_timetable`);
      return saved ? JSON.parse(saved) : initialTimetable;
    } catch {
      return initialTimetable;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_habits`);
      return saved ? JSON.parse(saved) : initialHabits;
    } catch {
      return initialHabits;
    }
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : initialGoals;
    } catch {
      return initialGoals;
    }
  });

  const [metrics, setMetrics] = useState<ProductivityMetric[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_metrics`);
      return saved ? JSON.parse(saved) : initialProductivityHistory;
    } catch {
      return initialProductivityHistory;
    }
  });

  const [achievements, setAchievements] = useState<UserAchievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : initialAchievements;
    } catch {
      return initialAchievements;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error'; id: number } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now();
    setToast({ message, type, id });
    if (settings.enableSoundEffects) {
      if (type === 'success') soundEngine.playSuccess(0.2);
      else soundEngine.playClick(0.15);
    }
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  }, [settings.enableSoundEffects]);

  // Focus Timer State
  const [focusState, setFocusState] = useState<{
    isRunning: boolean;
    timeLeft: number;
    initialDuration: number;
    mode: 'pomodoro' | 'shortBreak' | 'longBreak';
    sessionsCompleted: number;
    ambientSound: 'none' | 'rain' | 'space' | 'lofi' | 'whitenoise';
  }>({
    isRunning: false,
    timeLeft: 25 * 60,
    initialDuration: 25 * 60,
    mode: 'pomodoro',
    sessionsCompleted: 4,
    ambientSound: 'none',
  });

  // Focus Timer Tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (focusState.isRunning && focusState.timeLeft > 0) {
      interval = setInterval(() => {
        setFocusState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (focusState.isRunning && focusState.timeLeft === 0) {
      if (settings.enableSoundEffects) {
        soundEngine.playBell(0.4);
      }
      triggerConfetti();
      showToast(
        focusState.mode === 'pomodoro' ? 'Deep Work session complete! +50 XP' : 'Break finished! Ready to focus?',
        'success'
      );
      if (focusState.mode === 'pomodoro') {
        addXP(50, 'Completed Deep Work Pomodoro');
        setProfile((prev) => ({
          ...prev,
          totalFocusHours: parseFloat((prev.totalFocusHours + 0.42).toFixed(1)),
        }));
      }
      setFocusState((prev) => ({
        ...prev,
        isRunning: false,
        sessionsCompleted: prev.mode === 'pomodoro' ? prev.sessionsCompleted + 1 : prev.sessionsCompleted,
        timeLeft: prev.mode === 'pomodoro' ? 5 * 60 : 25 * 60,
        mode: prev.mode === 'pomodoro' ? 'shortBreak' : 'pomodoro',
      }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusState.isRunning, focusState.timeLeft, focusState.mode, settings.enableSoundEffects, showToast]);

  // Ambient sound handler
  const setAmbientSound = useCallback((sound: 'none' | 'rain' | 'space' | 'lofi' | 'whitenoise') => {
    setFocusState((prev) => ({ ...prev, ambientSound: sound }));
    if (sound === 'none') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.startAmbient(sound, settings.soundVolume);
    }
  }, [settings.soundVolume]);

  const startFocusTimer = useCallback(() => {
    setFocusState((prev) => ({ ...prev, isRunning: true }));
    if (settings.enableSoundEffects) soundEngine.playClick(0.2);
  }, [settings.enableSoundEffects]);

  const pauseFocusTimer = useCallback(() => {
    setFocusState((prev) => ({ ...prev, isRunning: false }));
    if (settings.enableSoundEffects) soundEngine.playClick(0.15);
  }, [settings.enableSoundEffects]);

  const resetFocusTimer = useCallback(() => {
    setFocusState((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.initialDuration,
    }));
  }, []);

  const setFocusMode = useCallback((mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    const duration = mode === 'pomodoro' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
    setFocusState((prev) => ({
      ...prev,
      mode,
      isRunning: false,
      initialDuration: duration,
      timeLeft: duration,
    }));
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_timetable`, JSON.stringify(timetable));
      localStorage.setItem(`${STORAGE_KEY}_habits`, JSON.stringify(habits));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
      localStorage.setItem(`${STORAGE_KEY}_metrics`, JSON.stringify(metrics));
      localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(achievements));
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch {
      // quota or storage error
    }
  }, [tasks, timetable, habits, goals, metrics, achievements, profile, settings, notifications]);

  // Apply theme class to HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-accent', settings.accent);
    if (settings.theme === 'light' || settings.theme === 'apple-frost') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [settings.theme, settings.accent]);

  // Keyboard Shortcuts (Cmd+K / Ctrl+K for command palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAiModalOpen(false);
        setIsAuthModalOpen(false);
        setIsNotificationDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // XP & Level Progression System
  const addXP = useCallback((amount: number, reason?: string) => {
    setProfile((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 600) + 1;
      let newTitle = prev.levelTitle;

      if (newLevel >= 10) newTitle = 'Cosmic Titan';
      else if (newLevel >= 8) newTitle = 'Cosmic Strategist';
      else if (newLevel >= 6) newTitle = 'Quantum Architect';
      else if (newLevel >= 4) newTitle = 'Hyper Executor';
      else if (newLevel >= 2) newTitle = 'Flow Initiate';

      if (newLevel > prev.level) {
        if (settings.enableSoundEffects) soundEngine.playLevelUp(0.35);
        triggerConfetti();
        showToast(`⚡ LEVEL UP! You reached Level ${newLevel} (${newTitle})!`, 'success');
      } else if (reason) {
        showToast(`+${amount} XP: ${reason}`, 'info');
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        levelTitle: newTitle,
      };
    });
  }, [settings.enableSoundEffects, showToast]);

  // TASK ACTIONS
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    addXP(30, 'Created new mission task');
    showToast(`Task "${newTask.title}" added to queue`, 'success');
  }, [addXP, showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
    showToast('Task updated', 'info');
  }, [showToast]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'warning');
  }, [showToast]);

  const duplicateTask = useCallback((id: string) => {
    setTasks((prev) => {
      const existing = prev.find((t) => t.id === id);
      if (!existing) return prev;
      const copy: Task = {
        ...existing,
        id: `task_${Date.now()}_copy`,
        title: `${existing.title} (Copy)`,
        status: 'Todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return [copy, ...prev];
    });
    showToast('Task duplicated', 'info');
  }, [showToast]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowDone = t.status !== 'Done';
          if (isNowDone) {
            if (settings.enableSoundEffects) soundEngine.playSuccess(0.25);
            triggerConfetti();
            addXP(40, `Completed task: ${t.title}`);
            setProfile((p) => ({ ...p, totalTasksCompleted: p.totalTasksCompleted + 1 }));
          }
          return {
            ...t,
            status: isNowDone ? 'Done' : 'Todo',
            completedAt: isNowDone ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  }, [settings.enableSoundEffects, addXP]);

  const toggleTaskPin = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const toggleTaskStar = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isStarred: !t.isStarred, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const toggleTaskArchive = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isArchived: !t.isArchived, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const reorderTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const bulkDeleteTasks = useCallback((ids: string[]) => {
    setTasks((prev) => prev.filter((t) => !ids.includes(t.id)));
    showToast(`Deleted ${ids.length} tasks`, 'warning');
  }, [showToast]);

  const bulkCompleteTasks = useCallback((ids: string[]) => {
    setTasks((prev) =>
      prev.map((t) =>
        ids.includes(t.id) ? { ...t, status: 'Done', completedAt: new Date().toISOString() } : t
      )
    );
    triggerConfetti();
    addXP(ids.length * 35, `Completed ${ids.length} batch tasks`);
    showToast(`Marked ${ids.length} tasks complete!`, 'success');
  }, [addXP, showToast]);

  const bulkUpdateCategory = useCallback((ids: string[], category: TaskCategory) => {
    setTasks((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, category } : t))
    );
    showToast(`Updated category to ${category} for ${ids.length} tasks`, 'info');
  }, [showToast]);

  // TIMETABLE ACTIONS & CONFLICT DETECTION
  const addTimetableEvent = useCallback((eventData: Omit<TimetableEvent, 'id'>) => {
    const newEvent: TimetableEvent = {
      ...eventData,
      id: `tt_${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newEvent]);
    showToast(`Added schedule block "${newEvent.title}"`, 'success');
  }, [showToast]);

  const updateTimetableEvent = useCallback((id: string, updates: Partial<TimetableEvent>) => {
    setTimetable((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)));
    showToast('Schedule event updated', 'info');
  }, [showToast]);

  const deleteTimetableEvent = useCallback((id: string) => {
    setTimetable((prev) => prev.filter((ev) => ev.id !== id));
    showToast('Schedule event removed', 'warning');
  }, [showToast]);

  // Detect time block conflicts on the same day
  const timetableConflicts = useMemo(() => {
    const conflicts: { event1: TimetableEvent; event2: TimetableEvent }[] = [];
    for (let i = 0; i < timetable.length; i++) {
      for (let j = i + 1; j < timetable.length; j++) {
        const a = timetable[i];
        const b = timetable[j];
        if (a.dayOfWeek === b.dayOfWeek) {
          // Check time overlap: (StartA < EndB) and (EndA > StartB)
          if (a.startTime < b.endTime && a.endTime > b.startTime) {
            conflicts.push({ event1: a, event2: b });
          }
        }
      }
    }
    return conflicts;
  }, [timetable]);

  const resolveConflictWithAI = useCallback((event1Id: string, event2Id: string) => {
    setTimetable((prev) => {
      const e1 = prev.find((x) => x.id === event1Id);
      const e2 = prev.find((x) => x.id === event2Id);
      if (!e1 || !e2) return prev;

      // Adjust second event's start time to after first event's end time
      const [endHour, endMin] = e1.endTime.split(':').map(Number);
      const newStartHour = String(endHour).padStart(2, '0');
      const newStartMin = String(endMin).padStart(2, '0');
      const newEndHour = String(Math.min(23, endHour + 1)).padStart(2, '0');

      return prev.map((ev) =>
        ev.id === event2Id
          ? {
              ...ev,
              startTime: `${newStartHour}:${newStartMin}`,
              endTime: `${newEndHour}:${newStartMin}`,
            }
          : ev
      );
    });
    showToast('AI automatically resolved time slot collision!', 'success');
  }, [showToast]);

  const loadTimetableTemplate = useCallback((templateName: 'college' | 'work' | 'intense') => {
    if (templateName === 'college') {
      setTimetable(initialTimetable);
    } else if (templateName === 'work') {
      setTimetable([
        {
          id: 'tt_w1',
          title: 'Daily Standup & Sync',
          category: 'Work',
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '09:45',
          isRecurring: true,
          type: 'Meeting',
          color: '#10b981',
        },
        {
          id: 'tt_w2',
          title: 'Feature Architecture & Core Code',
          category: 'Coding',
          dayOfWeek: 'Monday',
          startTime: '10:00',
          endTime: '13:00',
          isRecurring: true,
          type: 'Deep Work',
          color: '#06b6d4',
        },
        {
          id: 'tt_w3',
          title: 'PR Reviews & Architecture Alignment',
          category: 'Work',
          dayOfWeek: 'Tuesday',
          startTime: '14:00',
          endTime: '16:00',
          isRecurring: true,
          type: 'Meeting',
          color: '#8b5cf6',
        },
      ]);
    } else {
      // Intense sprint
      setTimetable(initialTimetable);
    }
    showToast(`Loaded ${templateName.toUpperCase()} timetable preset`, 'success');
  }, [showToast]);

  // HABIT ACTIONS
  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `hb_${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
    showToast(`Habit routine "${newHabit.name}" initialized`, 'success');
  }, [showToast]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
    showToast('Habit updated', 'info');
  }, [showToast]);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showToast('Habit removed', 'warning');
  }, [showToast]);

  const toggleHabitForDate = useCallback((id: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const isCompleted = h.completedDates.includes(dateStr);
          let newCompleted: string[];
          let newStreak = h.streak;

          if (isCompleted) {
            newCompleted = h.completedDates.filter((d) => d !== dateStr);
            newStreak = Math.max(0, newStreak - 1);
          } else {
            newCompleted = [dateStr, ...h.completedDates];
            newStreak = newStreak + 1;
            if (settings.enableSoundEffects) soundEngine.playSuccess(0.2);
            triggerConfetti();
            addXP(h.xpReward || 50, `Completed habit: ${h.name}`);
          }

          const newBest = Math.max(h.bestStreak, newStreak);
          return {
            ...h,
            completedDates: newCompleted,
            streak: newStreak,
            bestStreak: newBest,
          };
        }
        return h;
      })
    );
  }, [settings.enableSoundEffects, addXP]);

  // GOAL ACTIONS
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'progress' | 'isCompleted' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      progress: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(`Goal objective "${newGoal.title}" locked in!`, 'success');
  }, [showToast]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Goal updated', 'info');
  }, [showToast]);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal objective removed', 'warning');
  }, [showToast]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.completed).length;
          const progress = updatedMilestones.length > 0
            ? Math.round((completedCount / updatedMilestones.length) * 100)
            : 100;
          const isCompleted = progress === 100;

          if (isCompleted && !g.isCompleted) {
            triggerConfetti();
            if (settings.enableSoundEffects) soundEngine.playLevelUp(0.3);
            addXP(g.rewardXP, `Goal Achieved: ${g.title}`);
          }

          return {
            ...g,
            milestones: updatedMilestones,
            progress,
            isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined,
          };
        }
        return g;
      })
    );
  }, [settings.enableSoundEffects, addXP]);

  // NOTIFICATION ACTIONS
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  }, [showToast]);

  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // SETTINGS
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Preferences updated', 'info');
  }, [showToast]);

  const resetToDefaultData = useCallback(() => {
    setTasks(initialTasks);
    setTimetable(initialTimetable);
    setHabits(initialHabits);
    setGoals(initialGoals);
    setMetrics(initialProductivityHistory);
    setAchievements(initialAchievements);
    setProfile(initialProfile);
    setSettings(initialSettings);
    setNotifications(initialNotifications);
    showToast('Reset to clean dataset', 'info');
  }, [showToast]);

  const clearAllData = useCallback(() => {
    setTasks([]);
    setTimetable([]);
    setHabits([]);
    setGoals([]);
    setNotifications([]);
    setMetrics(initialProductivityHistory);
    setProfile(initialProfile);
    showToast('Clean canvas activated! Ready for your tasks.', 'success');
  }, [showToast]);

  const value = useMemo(
    () => ({
      activePage,
      setActivePage,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isAiModalOpen,
      setIsAiModalOpen,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen,
      isLoggedIn,
      setIsLoggedIn,
      searchQuery,
      setSearchQuery,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      selectedPriorityFilter,
      setSelectedPriorityFilter,
      selectedStatusFilter,
      setSelectedStatusFilter,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      duplicateTask,
      toggleTaskComplete,
      toggleTaskPin,
      toggleTaskStar,
      toggleTaskArchive,
      reorderTasks,
      bulkDeleteTasks,
      bulkCompleteTasks,
      bulkUpdateCategory,
      timetable,
      addTimetableEvent,
      updateTimetableEvent,
      deleteTimetableEvent,
      timetableConflicts,
      resolveConflictWithAI,
      loadTimetableTemplate,
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitForDate,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleMilestone,
      focusState,
      startFocusTimer,
      pauseFocusTimer,
      resetFocusTimer,
      setFocusMode,
      setAmbientSound,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      clearNotifications,
      metrics,
      achievements,
      profile,
      addXP,
      settings,
      updateSettings,
      resetToDefaultData,
      clearAllData,
      toast,
      showToast,
    }),
    [
      activePage,
      isCommandPaletteOpen,
      isAuthModalOpen,
      isAiModalOpen,
      isNotificationDrawerOpen,
      isLoggedIn,
      searchQuery,
      selectedCategoryFilter,
      selectedPriorityFilter,
      selectedStatusFilter,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      duplicateTask,
      toggleTaskComplete,
      toggleTaskPin,
      toggleTaskStar,
      toggleTaskArchive,
      reorderTasks,
      bulkDeleteTasks,
      bulkCompleteTasks,
      bulkUpdateCategory,
      timetable,
      addTimetableEvent,
      updateTimetableEvent,
      deleteTimetableEvent,
      timetableConflicts,
      resolveConflictWithAI,
      loadTimetableTemplate,
      habits,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleHabitForDate,
      goals,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleMilestone,
      focusState,
      startFocusTimer,
      pauseFocusTimer,
      resetFocusTimer,
      setFocusMode,
      setAmbientSound,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      clearNotifications,
      metrics,
      achievements,
      profile,
      addXP,
      settings,
      updateSettings,
      resetToDefaultData,
      clearAllData,
      toast,
      showToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
