import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTaskContext } from '@/contexts/TaskContext';

interface ProgressLineChartProps {
  days?: number;
}

export function ProgressLineChart({ days = 14 }: ProgressLineChartProps) {
  const { getDailyStats } = useTaskContext();

  const data = useMemo(() => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      
      return {
        date: format(date, 'MMM d'),
        fullDate: dateStr,
        completion: Math.round(stats.rate),
        completed: stats.completed,
        total: stats.total,
      };
    });
  }, [getDailyStats, days]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-lg font-bold text-primary">{data.completion}%</p>
          <p className="text-xs text-muted-foreground">
            {data.completed}/{data.total} tasks
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Daily Progress Trend
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last {days} days</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="completion"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              fill="url(#progressGradient)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
