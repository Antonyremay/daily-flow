import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarDays, 
  BarChart3, 
  Plus,
  Flame
} from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/today', icon: CalendarCheck, label: 'Today' },
  { path: '/weekly', icon: CalendarDays, label: 'Weekly' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export function Sidebar() {
  const location = useLocation();
  const { getOverallStreak } = useTaskContext();
  const streak = getOverallStreak();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-border/50 z-50">
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
            <CalendarCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">TimeTrack</h1>
            <p className="text-xs text-muted-foreground">Progress Tracker</p>
          </div>
        </div>

        {/* Streak Badge */}
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-3 mb-6 p-3 rounded-xl bg-gradient-to-r from-warning/20 to-destructive/20 border border-warning/30"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-semibold text-warning">{streak} Day Streak!</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg glow-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 relative z-10 transition-transform group-hover:scale-110",
                  isActive && "text-primary-foreground"
                )} />
                <span className="relative z-10 font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Add Task Button */}
        <NavLink
          to="/new-task"
          className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold transition-all hover:opacity-90 glow-primary"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </NavLink>
      </div>
    </aside>
  );
}
