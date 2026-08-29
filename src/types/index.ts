export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TaskCategory =
  | 'Study'
  | 'College'
  | 'Work'
  | 'Personal'
  | 'Gym'
  | 'Health'
  | 'Finance'
  | 'Coding'
  | 'Shopping'
  | 'Others';

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  deadline: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  reminder?: string;
  notes?: string;
  tags: string[];
  estimatedDuration: number; // in minutes
  loggedDuration?: number; // in minutes
  attachments?: string[];
  subtasks: Subtask[];
  status: TaskStatus;
  isPinned?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableEvent {
  id: string;
  title: string;
  category: TaskCategory;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm (e.g. '09:00')
  endTime: string; // HH:mm (e.g. '10:30')
  roomOrLocation?: string;
  color?: string;
  isRecurring: boolean;
  notes?: string;
  reminderMinutesBefore?: number;
  type?: 'Lecture' | 'Lab' | 'Deep Work' | 'Workout' | 'Study Session' | 'Meeting' | 'Break';
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  frequency: 'Daily' | 'Weekly' | 'Custom';
  targetDaysPerWeek?: number;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ['2026-08-29', '2026-08-28']
  color: string;
  iconName: string;
  xpReward: number;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  type: 'Short-term' | 'Long-term';
  targetDate: string;
  milestones: Milestone[];
  progress: number; // 0 - 100
  color: string;
  rewardXP: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'due' | 'missed' | 'goal' | 'achievement' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ProductivityMetric {
  date: string;
  completionRate: number; // 0 - 100
  tasksCompleted: number;
  tasksDue: number;
  focusMinutes: number;
  habitsCompleted: number;
  score: number; // 0 - 100
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpValue: number;
  category: 'speed' | 'consistency' | 'focus' | 'mastery' | 'streak';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  totalFocusHours: number;
  totalTasksCompleted: number;
}

export type ThemeMode = 'dark' | 'light' | 'matrix' | 'cyberpunk' | 'apple-frost' | 'midnight-oled';
export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'sapphire';

export interface AppSettings {
  theme: ThemeMode;
  accent: AccentColor;
  glassIntensity: number; // 1 to 10
  glowIntensity: number; // 1 to 10
  enable3D: boolean;
  enableParticles: boolean;
  enableSoundEffects: boolean;
  soundVolume: number; // 0 to 1
  ambientLighting: boolean;
  defaultTaskView: 'list' | 'kanban' | 'calendar' | 'matrix' | 'gantt';
  autoScheduleAI: boolean;
  dbType: 'local' | 'mongodb' | 'supabase' | 'firebase' | 'postgresql';
  dbConfig?: {
    endpoint?: string;
    apiKey?: string;
    connected?: boolean;
    lastSynced?: string;
  };
}
