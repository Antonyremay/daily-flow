import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, parseISO, startOfDay, isBefore, isAfter } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';

interface CheckboxMatrixProps {
  startDate: Date;
  days?: number;
}

export function CheckboxMatrix({ startDate, days = 30 }: CheckboxMatrixProps) {
  const { tasks, progress, toggleDailyProgress } = useTaskContext();

  const dates = useMemo(() => {
    return Array.from({ length: days }, (_, i) => addDays(startDate, i));
  }, [startDate, days]);

  const isTaskActiveOnDate = (task: typeof tasks[0], date: Date): boolean => {
    const targetDate = startOfDay(date);
    const taskStart = startOfDay(parseISO(task.startDate));
    
    if (isBefore(targetDate, taskStart)) return false;
    
    if (task.endDate) {
      const taskEnd = startOfDay(parseISO(task.endDate));
      if (isAfter(targetDate, taskEnd)) return false;
    }
    
    return true;
  };

  const isDateCompleted = (taskId: string, dateStr: string): boolean => {
    return progress.some(p => p.taskId === taskId && p.date === dateStr && p.completed);
  };

  const isDateMissed = (task: typeof tasks[0], date: Date, dateStr: string): boolean => {
    const today = startOfDay(new Date());
    if (!isBefore(date, today)) return false;
    if (!isTaskActiveOnDate(task, date)) return false;
    return !isDateCompleted(task.id, dateStr);
  };

  const handleCellClick = (taskId: string, dateStr: string, isActive: boolean) => {
    if (!isActive) return;
    toggleDailyProgress(taskId, dateStr);
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 rounded-2xl glass text-center"
      >
        <p className="text-muted-foreground">No tasks yet. Create a task to start tracking!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6 rounded-2xl glass overflow-hidden"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        Daily Progress Matrix
      </h3>
      
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-max">
          {/* Header Row - Dates */}
          <div className="flex">
            <div className="w-40 lg:w-48 flex-shrink-0 p-2 text-sm font-medium text-muted-foreground border-b border-border/30">
              Task
            </div>
            {dates.map((date) => {
              const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "w-10 flex-shrink-0 p-1 text-center text-xs border-b border-border/30",
                    isToday && "bg-primary/10 rounded-t-lg"
                  )}
                >
                  <div className="text-muted-foreground">{format(date, 'EEE')}</div>
                  <div className={cn("font-medium", isToday && "text-primary")}>
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Task Rows */}
          {tasks.map((task, taskIndex) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: taskIndex * 0.03 }}
              className="flex group hover:bg-secondary/20"
            >
              {/* Task Name Column */}
              <div className="w-40 lg:w-48 flex-shrink-0 p-2 flex items-center gap-2 border-b border-border/20">
                <div
                  className={cn(
                    "w-1.5 h-8 rounded-full flex-shrink-0",
                    task.priority === 'high' && "bg-destructive",
                    task.priority === 'medium' && "bg-warning",
                    task.priority === 'low' && "bg-muted-foreground/50"
                  )}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{task.name}</p>
                  {task.category && (
                    <p className="text-xs text-muted-foreground truncate">{task.category}</p>
                  )}
                </div>
              </div>

              {/* Checkbox Cells */}
              {dates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isActive = isTaskActiveOnDate(task, date);
                const isCompleted = isDateCompleted(task.id, dateStr);
                const isMissed = isDateMissed(task, date, dateStr);
                const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
                const isFuture = isAfter(startOfDay(date), startOfDay(new Date()));

                return (
                  <div
                    key={dateStr}
                    className={cn(
                      "w-10 flex-shrink-0 p-1 flex items-center justify-center border-b border-border/20",
                      isToday && "bg-primary/10"
                    )}
                  >
                    {isActive ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCellClick(task.id, dateStr, isActive)}
                        className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                          isCompleted && "bg-success text-success-foreground glow-success",
                          isMissed && "bg-destructive/30 text-destructive border border-destructive/50",
                          !isCompleted && !isMissed && isFuture && "bg-secondary/50 border border-border/50 hover:border-primary hover:bg-primary/10",
                          !isCompleted && !isMissed && !isFuture && isToday && "bg-primary/20 border-2 border-primary hover:bg-primary/30"
                        )}
                      >
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                        {isMissed && <X className="w-3 h-3" />}
                      </motion.button>
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-muted/20" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-success flex items-center justify-center">
            <Check className="w-3 h-3 text-success-foreground" />
          </div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-destructive/30 border border-destructive/50 flex items-center justify-center">
            <X className="w-3 h-3 text-destructive" />
          </div>
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-primary/20 border-2 border-primary" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-secondary/50 border border-border/50" />
          <span>Future</span>
        </div>
      </div>
    </motion.div>
  );
}
