import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { useTaskContext } from '@/contexts/TaskContext';

export function WeeklyChart() {
  const { getDailyStats } = useTaskContext();

  const data = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      
      return {
        name: format(date, 'EEE'),
        date: format(date, 'MMM d'),
        completion: Math.round(stats.rate),
        completed: stats.completed,
        total: stats.total,
      };
    });
  }, [getDailyStats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl glass"
    >
      <h3 className="text-lg font-semibold mb-4">This Week's Progress</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              formatter={(value: number) => [`${value}%`, 'Completion']}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.date}: ${payload[0].payload.completed}/${payload[0].payload.total} tasks`;
                }
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey="completion"
              stroke="hsl(262, 83%, 58%)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCompletion)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
