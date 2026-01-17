export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  description?: string;
  category?: string;
  startDate: string;
  endDate?: string;
  priority: Priority;
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  taskId: string;
  completed: boolean;
}

export interface TaskWithProgress extends Task {
  todayCompleted: boolean;
  totalDays: number;
  completedDays: number;
  streak: number;
  completionRate: number;
}

export interface WeeklyStats {
  week: string;
  startDate: string;
  endDate: string;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

export interface DailyStats {
  date: string;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
}

export interface TaskStatusBreakdown {
  completed: number;
  inProgress: number;
  pending: number;
  missed: number;
}
