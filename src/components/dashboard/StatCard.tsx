import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  delay?: number;
}

const variantStyles = {
  default: 'from-secondary to-secondary/50',
  primary: 'from-primary/20 to-accent/10 border-primary/30',
  success: 'from-success/20 to-success/5 border-success/30',
  warning: 'from-warning/20 to-warning/5 border-warning/30',
};

const iconStyles = {
  default: 'bg-secondary text-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "p-5 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.02]",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && trendValue && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-success/20 text-success",
            trend === 'down' && "bg-destructive/20 text-destructive",
            trend === 'neutral' && "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
