import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subMonths } from 'date-fns';
import { useTaskContext } from '@/contexts/TaskContext';

export function MonthlyBarChart() {
  const { getMonthlyStats } = useTaskContext();

  const data = useMemo(() => {
    const today = new Date();
    
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, 5 - i);
      const stats = getMonthlyStats(date.getFullYear(), date.getMonth());
      
      return {
        name: format(date, 'MMM'),
        fullName: format(date, 'MMMM yyyy'),
        completion: Math.round(stats.rate),
        completed: stats.completed,
        total: stats.total,
      };
    });
  }, [getMonthlyStats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl glass"
    >
      <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return `${payload[0].payload.fullName}: ${payload[0].payload.completed}/${payload[0].payload.total} tasks`;
                }
                return '';
              }}
            />
            <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.completion >= 75 
                      ? 'hsl(142, 71%, 45%)' 
                      : entry.completion >= 50 
                      ? 'hsl(38, 92%, 50%)' 
                      : 'hsl(262, 83%, 58%)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
