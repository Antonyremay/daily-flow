import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function WeeklyView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { getDailyStats, getWeeklyStats, getTasksWithProgress } = useTaskContext();

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weeklyStats = getWeeklyStats(weekStartStr);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      const tasks = getTasksWithProgress(dateStr);
      
      return {
        date,
        dateStr,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        stats,
        tasks,
        isToday: format(new Date(), 'yyyy-MM-dd') === dateStr,
      };
    });
  }, [weekStart, getDailyStats, getTasksWithProgress]);

  const goToThisWeek = () => setWeekOffset(0);
  const goPrev = () => setWeekOffset(w => w - 1);
  const goNext = () => setWeekOffset(w => w + 1);

  const isCurrentWeek = weekOffset === 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrev}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {isCurrentWeek ? (
                  <span className="gradient-text">This Week</span>
                ) : (
                  `Week of ${format(weekStart, 'MMM d')}`
                )}
              </h1>
              <p className="text-muted-foreground text-sm">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goNext}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {!isCurrentWeek && (
            <Button variant="outline" onClick={goToThisWeek}>
              This Week
            </Button>
          )}
        </motion.div>

        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl glass flex flex-col sm:flex-row items-center gap-6"
        >
          <ProgressRing progress={weeklyStats.rate} size={140} strokeWidth={12} />
          
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-semibold mb-2">
              Weekly Progress
            </h2>
            <p className="text-muted-foreground mb-4">
              {weeklyStats.completed} of {weeklyStats.total} tasks completed
            </p>
            
            {weeklyStats.rate >= 75 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 text-success text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                Great week! Keep it up!
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Daily Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {days.map((day, index) => (
            <motion.div
              key={day.dateStr}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={cn(
                "p-4 rounded-xl glass text-center transition-all hover:scale-105 cursor-pointer",
                day.isToday && "ring-2 ring-primary glow-primary"
              )}
            >
              <p className={cn(
                "text-sm font-medium mb-1",
                day.isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {day.dayName}
              </p>
              <p className={cn(
                "text-2xl font-bold mb-3",
                day.isToday && "text-primary"
              )}>
                {day.dayNumber}
              </p>
              
              <ProgressRing 
                progress={day.stats.rate} 
                size={60} 
                strokeWidth={6} 
                showLabel={false}
              />
              
              <div className="mt-3 text-xs text-muted-foreground">
                {day.stats.completed}/{day.stats.total} tasks
              </div>
              
              <div className={cn(
                "mt-2 text-sm font-semibold",
                day.stats.rate >= 100 ? "text-success" :
                day.stats.rate >= 50 ? "text-warning" :
                day.stats.rate > 0 ? "text-primary" :
                "text-muted-foreground"
              )}>
                {Math.round(day.stats.rate)}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Day View (collapsible cards) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Daily Details</h3>
          
          {days.map((day, index) => (
            <motion.div
              key={`detail-${day.dateStr}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              className={cn(
                "p-4 rounded-xl glass",
                day.isToday && "ring-1 ring-primary/50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
                    day.isToday 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-foreground"
                  )}>
                    {day.dayNumber}
                  </div>
                  <div>
                    <p className="font-medium">{format(day.date, 'EEEE')}</p>
                    <p className="text-xs text-muted-foreground">{format(day.date, 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    day.stats.rate >= 100 ? "text-success" :
                    day.stats.rate >= 50 ? "text-warning" :
                    "text-muted-foreground"
                  )}>
                    {Math.round(day.stats.rate)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {day.stats.completed}/{day.stats.total} done
                  </p>
                </div>
              </div>
              
              {/* Task dots */}
              <div className="flex flex-wrap gap-1.5">
                {day.tasks.map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      task.todayCompleted 
                        ? "bg-success glow-success" 
                        : task.priority === 'high'
                        ? "bg-destructive"
                        : task.priority === 'medium'
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    )}
                    title={task.name}
                  />
                ))}
                {day.tasks.length === 0 && (
                  <span className="text-xs text-muted-foreground">No tasks</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
