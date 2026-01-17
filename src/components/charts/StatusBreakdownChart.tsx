import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay, parseISO, isBefore, isAfter } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTaskContext } from '@/contexts/TaskContext';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export function StatusBreakdownChart() {
  const { tasks, progress, getDailyStats } = useTaskContext();

  const breakdown = useMemo(() => {
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');
    
    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let missed = 0;

    tasks.forEach(task => {
      const taskStart = startOfDay(parseISO(task.startDate));
      const taskEnd = task.endDate ? startOfDay(parseISO(task.endDate)) : null;
      
      // Count completed days for this task
      const taskProgress = progress.filter(p => p.taskId === task.id && p.completed);
      const completedDays = taskProgress.length;

      // Calculate total active days up to today
      let totalDays = 0;
      let missedDays = 0;
      
      for (let d = taskStart; !isAfter(d, today) && (!taskEnd || !isAfter(d, taskEnd)); d = subDays(d, -1)) {
        totalDays++;
        const dateStr = format(d, 'yyyy-MM-dd');
        const wasCompleted = progress.some(p => p.taskId === task.id && p.date === dateStr && p.completed);
        if (!wasCompleted && isBefore(d, today)) {
          missedDays++;
        }
      }

      completed += completedDays;
      missed += missedDays;

      // Check if task is in progress today
      const isTodayActive = !isBefore(today, taskStart) && (!taskEnd || !isAfter(today, taskEnd));
      const todayCompleted = progress.some(p => p.taskId === task.id && p.date === todayStr && p.completed);
      
      if (isTodayActive && !todayCompleted) {
        pending++;
      }

      // In progress = active tasks that have some completions
      if (isTodayActive && completedDays > 0 && !todayCompleted) {
        inProgress++;
      }
    });

    return { completed, inProgress, pending, missed };
  }, [tasks, progress]);

  const data = [
    { name: 'Completed', value: breakdown.completed, color: 'hsl(var(--success))' },
    { name: 'In Progress', value: breakdown.inProgress, color: 'hsl(var(--primary))' },
    { name: 'Pending', value: breakdown.pending, color: 'hsl(var(--warning))' },
    { name: 'Missed', value: breakdown.missed, color: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const icons = {
    Completed: CheckCircle2,
    'In Progress': Clock,
    Pending: AlertCircle,
    Missed: XCircle,
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.value} {data.value === 1 ? 'day' : 'days'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl glass"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        Status Breakdown
      </h3>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          {[
            { name: 'Completed', value: breakdown.completed, color: 'success', Icon: CheckCircle2 },
            { name: 'In Progress', value: breakdown.inProgress, color: 'primary', Icon: Clock },
            { name: 'Pending', value: breakdown.pending, color: 'warning', Icon: AlertCircle },
            { name: 'Missed', value: breakdown.missed, color: 'destructive', Icon: XCircle },
          ].map(({ name, value, color, Icon }) => (
            <div
              key={name}
              className={`p-3 rounded-lg bg-${color}/10 border border-${color}/20`}
              style={{
                backgroundColor: `hsl(var(--${color}) / 0.1)`,
                borderColor: `hsl(var(--${color}) / 0.2)`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon 
                  className="w-4 h-4" 
                  style={{ color: `hsl(var(--${color}))` }}
                />
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
              <p 
                className="text-xl font-bold"
                style={{ color: `hsl(var(--${color}))` }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
