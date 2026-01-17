import { motion } from 'framer-motion';
import { Check, Flame, Trash2, Calendar, Flag } from 'lucide-react';
import { TaskWithProgress } from '@/types/task';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: TaskWithProgress;
  date: string;
  index: number;
}

const priorityStyles = {
  low: 'border-l-muted-foreground/50',
  medium: 'border-l-warning',
  high: 'border-l-destructive',
};

const priorityBadgeStyles = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-destructive/20 text-destructive',
};

export function TaskCard({ task, date, index }: TaskCardProps) {
  const { toggleDailyProgress, deleteTask } = useTaskContext();

  const handleToggle = () => {
    toggleDailyProgress(task.id, date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "group relative p-4 rounded-xl glass border-l-4 transition-all",
        priorityStyles[task.priority],
        task.todayCompleted && "opacity-75"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={cn(
            "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
            task.todayCompleted
              ? "bg-success border-success text-success-foreground glow-success"
              : "border-muted-foreground/50 hover:border-primary"
          )}
        >
          {task.todayCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={cn(
                "font-semibold transition-all",
                task.todayCompleted && "line-through text-muted-foreground"
              )}>
                {task.name}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full flex items-center gap-1",
              priorityBadgeStyles[task.priority]
            )}>
              <Flag className="w-3 h-3" />
              {task.priority}
            </span>
            
            {task.endDate && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Until {format(parseISO(task.endDate), 'MMM d')}
              </span>
            )}
            
            {task.streak > 0 && (
              <span className="text-xs text-warning flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {task.streak} day streak
              </span>
            )}
            
            <span className="text-xs text-muted-foreground">
              {task.completedDays}/{task.totalDays} days
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.completionRate}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Completion celebration */}
      {task.todayCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center glow-success"
        >
          <Check className="w-4 h-4 text-success-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
}
