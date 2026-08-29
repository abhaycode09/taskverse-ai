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
} from '../types';

export const initialProfile: UserProfile = {
  id: 'user_master_01',
  name: 'Commander',
  email: 'user@taskverse.ai',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'Quantum Executor',
  xp: 0,
  level: 1,
  levelTitle: 'Flow Initiate',
  streakDays: 0,
  totalFocusHours: 0,
  totalTasksCompleted: 0,
};

export const initialSettings: AppSettings = {
  theme: 'dark',
  accent: 'cyan',
  glassIntensity: 8,
  glowIntensity: 8,
  enable3D: true,
  enableParticles: true,
  enableSoundEffects: true,
  soundVolume: 0.35,
  ambientLighting: true,
  defaultTaskView: 'list',
  autoScheduleAI: true,
  dbType: 'local',
  dbConfig: {
    connected: true,
    lastSynced: new Date().toISOString(),
  },
};

// Clean empty arrays so user can create everything from scratch
export const initialTasks: Task[] = [];
export const initialTimetable: TimetableEvent[] = [];
export const initialHabits: Habit[] = [];
export const initialGoals: Goal[] = [];
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to TaskVerse AI',
    message: 'Your clean productivity canvas is ready. Create your first mission task or schedule a time block!',
    type: 'system',
    timestamp: 'Just now',
    read: false,
  },
];

// Generate last 7 days metrics baseline (0 completed)
export const initialProductivityHistory: ProductivityMetric[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toISOString().split('T')[0],
    completionRate: 0,
    tasksCompleted: 0,
    tasksDue: 0,
    focusMinutes: 0,
    habitsCompleted: 0,
    score: 0,
  };
});

export const initialAchievements: UserAchievement[] = [
  {
    id: 'ach_1',
    title: 'First Step to Mastery',
    description: 'Create and accomplish your very first mission task in TaskVerse.',
    icon: 'Zap',
    unlocked: false,
    xpValue: 100,
    category: 'speed',
  },
  {
    id: 'ach_2',
    title: 'Flow State Master',
    description: 'Log 2+ hours of uninterrupted deep focus in a single day.',
    icon: 'Brain',
    unlocked: false,
    xpValue: 250,
    category: 'focus',
  },
  {
    id: 'ach_3',
    title: 'Cosmic Unstoppable',
    description: 'Maintain a 7-day consecutive habit streak across your protocols.',
    icon: 'Flame',
    unlocked: false,
    xpValue: 350,
    category: 'streak',
  },
  {
    id: 'ach_4',
    title: 'Timetable Architect',
    description: 'Design and execute a zero-conflict weekly schedule.',
    icon: 'CalendarCheck',
    unlocked: false,
    xpValue: 150,
    category: 'consistency',
  },
  {
    id: 'ach_5',
    title: 'Singularity Apex',
    description: 'Reach Level 10 Cosmic Titan rank and amass 10,000 XP.',
    icon: 'Crown',
    unlocked: false,
    xpValue: 1000,
    category: 'mastery',
  },
  {
    id: 'ach_6',
    title: 'Zenith Strategist',
    description: 'Complete 3 major long-term OKR milestone goals.',
    icon: 'Target',
    unlocked: false,
    xpValue: 500,
    category: 'mastery',
  },
];
