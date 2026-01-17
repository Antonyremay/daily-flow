import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, DailyProgress, TaskWithProgress, Priority } from '@/types/task';
import { format, parseISO, isAfter, isBefore, startOfDay, differenceInDays, subDays, isEqual } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  progress: DailyProgress[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;
  toggleDailyProgress: (taskId: string, date: string) => void;
  getTasksWithProgress: (date: string) => TaskWithProgress[];
  getDailyStats: (date: string) => { completed: number; total: number; rate: number };
  getWeeklyStats: (startDate: string) => { completed: number; total: number; rate: number };
  getMonthlyStats: (year: number, month: number) => { completed: number; total: number; rate: number };
  getStreak: (taskId: string) => number;
  getOverallStreak: () => number;
  getHeatmapData: () => { date: string; count: number; level: number }[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY_TASKS = 'timetable-tasks';
const STORAGE_KEY_PROGRESS = 'timetable-progress';

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : [];
  });

  const [progress, setProgress] = useState<DailyProgress[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setProgress(prev => prev.filter(p => p.taskId !== id));
  }, []);

  const toggleDailyProgress = useCallback((taskId: string, date: string) => {
    setProgress(prev => {
      const existing = prev.find(p => p.taskId === taskId && p.date === date);
      if (existing) {
        return prev.map(p =>
          p.taskId === taskId && p.date === date
            ? { ...p, completed: !p.completed }
            : p
        );
      }
      return [...prev, { taskId, date, completed: true }];
    });
  }, []);

  const isTaskActiveOnDate = useCallback((task: Task, date: string): boolean => {
    const targetDate = startOfDay(parseISO(date));
    const startDate = startOfDay(parseISO(task.startDate));
    
    if (isBefore(targetDate, startDate)) return false;
    
    if (task.endDate) {
      const endDate = startOfDay(parseISO(task.endDate));
      if (isAfter(targetDate, endDate)) return false;
    }
    
    return true;
  }, []);

  const getStreak = useCallback((taskId: string): number => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      if (!isTaskActiveOnDate(task, dateStr)) break;
      
      const dayProgress = progress.find(
        p => p.taskId === taskId && p.date === dateStr
      );
      
      if (dayProgress?.completed) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    return streak;
  }, [tasks, progress, isTaskActiveOnDate]);

  const getOverallStreak = useCallback((): number => {
    let streak = 0;
    let currentDate = startOfDay(new Date());

    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const activeTasks = tasks.filter(t => isTaskActiveOnDate(t, dateStr));
      
      if (activeTasks.length === 0) break;
      
      const allCompleted = activeTasks.every(task => {
        const dayProgress = progress.find(
          p => p.taskId === task.id && p.date === dateStr
        );
        return dayProgress?.completed;
      });
      
      if (allCompleted) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    return streak;
  }, [tasks, progress, isTaskActiveOnDate]);

  const getTasksWithProgress = useCallback((date: string): TaskWithProgress[] => {
    return tasks
      .filter(task => isTaskActiveOnDate(task, date))
      .map(task => {
        const todayProgress = progress.find(
          p => p.taskId === task.id && p.date === date
        );
        
        const startDate = startOfDay(parseISO(task.startDate));
        const endDate = task.endDate 
          ? startOfDay(parseISO(task.endDate)) 
          : startOfDay(new Date());
        const totalDays = Math.max(1, differenceInDays(endDate, startDate) + 1);
        
        const completedDays = progress.filter(
          p => p.taskId === task.id && p.completed
        ).length;
        
        return {
          ...task,
          todayCompleted: todayProgress?.completed ?? false,
          totalDays,
          completedDays,
          streak: getStreak(task.id),
          completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
        };
      });
  }, [tasks, progress, isTaskActiveOnDate, getStreak]);

  const getDailyStats = useCallback((date: string) => {
    const activeTasks = tasks.filter(t => isTaskActiveOnDate(t, date));
    const completedTasks = activeTasks.filter(task => {
      const dayProgress = progress.find(
        p => p.taskId === task.id && p.date === date
      );
      return dayProgress?.completed;
    });
    
    return {
      completed: completedTasks.length,
      total: activeTasks.length,
      rate: activeTasks.length > 0 
        ? (completedTasks.length / activeTasks.length) * 100 
        : 0,
    };
  }, [tasks, progress, isTaskActiveOnDate]);

  const getWeeklyStats = useCallback((startDate: string) => {
    let totalCompleted = 0;
    let totalTasks = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(parseISO(startDate), -i), 'yyyy-MM-dd');
      const stats = getDailyStats(date);
      totalCompleted += stats.completed;
      totalTasks += stats.total;
    }
    
    return {
      completed: totalCompleted,
      total: totalTasks,
      rate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0,
    };
  }, [getDailyStats]);

  const getMonthlyStats = useCallback((year: number, month: number) => {
    let totalCompleted = 0;
    let totalTasks = 0;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = format(new Date(year, month, day), 'yyyy-MM-dd');
      const stats = getDailyStats(date);
      totalCompleted += stats.completed;
      totalTasks += stats.total;
    }
    
    return {
      completed: totalCompleted,
      total: totalTasks,
      rate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0,
    };
  }, [getDailyStats]);

  const getHeatmapData = useCallback(() => {
    const data: { date: string; count: number; level: number }[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 364; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      
      let level = 0;
      if (stats.total > 0) {
        const rate = stats.rate;
        if (rate > 0) level = 1;
        if (rate >= 25) level = 2;
        if (rate >= 50) level = 3;
        if (rate >= 75) level = 4;
        if (rate === 100) level = 5;
      }
      
      data.push({
        date: dateStr,
        count: stats.completed,
        level,
      });
    }
    
    return data;
  }, [getDailyStats]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        progress,
        addTask,
        deleteTask,
        toggleDailyProgress,
        getTasksWithProgress,
        getDailyStats,
        getWeeklyStats,
        getMonthlyStats,
        getStreak,
        getOverallStreak,
        getHeatmapData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
