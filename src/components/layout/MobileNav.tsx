import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarDays, 
  BarChart3, 
  Plus 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/today', icon: CalendarCheck, label: 'Today' },
  { path: '/new-task', icon: Plus, label: 'Add', isAction: true },
  { path: '/weekly', icon: CalendarDays, label: 'Week' },
  { path: '/analytics', icon: BarChart3, label: 'Stats' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.isAction) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary"
              >
                <item.icon className="w-6 h-6" />
              </NavLink>
            );
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="text-xs font-medium relative z-10">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
