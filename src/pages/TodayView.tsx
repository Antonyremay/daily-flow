import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { TaskCard } from '@/components/tasks/TaskCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { Button } from '@/components/ui/button';

export default function TodayView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getTasksWithProgress, getDailyStats } = useTaskContext();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const tasks = getTasksWithProgress(dateStr);
  const stats = getDailyStats(dateStr);

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  const goToToday = () => setSelectedDate(new Date());
  const goPrev = () => setSelectedDate(subDays(selectedDate, 1));
  const goNext = () => setSelectedDate(addDays(selectedDate, 1));

  const completedTasks = tasks.filter(t => t.todayCompleted);
  const pendingTasks = tasks.filter(t => !t.todayCompleted);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Date Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={goPrev}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold">
              {isToday ? (
                <span className="gradient-text">Today</span>
              ) : (
                format(selectedDate, 'EEEE')
              )}
            </h1>
            <p className="text-muted-foreground">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
            {!isToday && (
              <button
                onClick={goToToday}
                className="text-sm text-primary hover:underline mt-1"
              >
                Go to today
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goNext}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl glass flex flex-col sm:flex-row items-center gap-6"
        >
          <ProgressRing progress={stats.rate} size={120} strokeWidth={10} />
          
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold mb-1">
              {stats.completed === stats.total && stats.total > 0
                ? "🎉 All done!"
                : `${stats.total - stats.completed} tasks remaining`}
            </h2>
            <p className="text-muted-foreground">
              {stats.completed} of {stats.total} tasks completed
            </p>
            
            {stats.rate >= 100 && stats.total > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 mt-3 text-success"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Perfect day! Keep it up!</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tasks List */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                To Do ({pendingTasks.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {pendingTasks.map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      date={dateStr} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {completedTasks.map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      date={dateStr} 
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tasks for this day</h3>
              <p className="text-muted-foreground mb-4">
                Create a new task to get started on your journey!
              </p>
              <Button
                onClick={() => window.location.href = '/new-task'}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Create Task
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
