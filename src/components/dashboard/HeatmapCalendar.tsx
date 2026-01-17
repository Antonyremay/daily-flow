import { motion } from 'framer-motion';
import { format, parseISO, getDay, startOfWeek, addDays, subWeeks } from 'date-fns';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const levelColors = [
  'bg-muted/30',
  'bg-success/20',
  'bg-success/40',
  'bg-success/60',
  'bg-success/80',
  'bg-success glow-success',
];

export function HeatmapCalendar() {
  const { getHeatmapData } = useTaskContext();
  const data = getHeatmapData();

  // Group data by weeks
  const weeks: { date: string; count: number; level: number }[][] = [];
  let currentWeek: { date: string; count: number; level: number }[] = [];
  
  data.forEach((day, index) => {
    const dayOfWeek = getDay(parseISO(day.date));
    
    if (index === 0) {
      // Pad the first week with empty cells
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push({ date: '', count: 0, level: 0 });
      }
    }
    
    currentWeek.push(day);
    
    if (dayOfWeek === 6 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="p-6 rounded-2xl glass">
      <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
      
      {/* Month labels */}
      <div className="flex mb-2 pl-8">
        {months.map((month, i) => (
          <span 
            key={month} 
            className="text-xs text-muted-foreground"
            style={{ width: `${100 / 12}%` }}
          >
            {month}
          </span>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-2">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
            <span key={i} className="text-xs text-muted-foreground h-3 leading-3">
              {day}
            </span>
          ))}
        </div>
        
        {/* Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <Tooltip key={dayIndex}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: weekIndex * 0.01 + dayIndex * 0.005,
                      duration: 0.2 
                    }}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-primary/50",
                      day.date ? levelColors[day.level] : 'bg-transparent'
                    )}
                  />
                </TooltipTrigger>
                {day.date && (
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-medium">
                      {format(parseISO(day.date), 'MMM d, yyyy')}
                    </p>
                    <p className="text-muted-foreground">
                      {day.count} task{day.count !== 1 ? 's' : ''} completed
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Less</span>
        {levelColors.map((color, i) => (
          <div
            key={i}
            className={cn("w-3 h-3 rounded-sm", color)}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}
