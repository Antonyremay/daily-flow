import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantColors = {
  default: 'stroke-primary',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-destructive',
};

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className,
  showLabel = true,
  variant = 'default'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getVariant = () => {
    if (variant !== 'default') return variant;
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'warning';
    if (progress >= 25) return 'default';
    return 'danger';
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={variantColors[getVariant()]}
          style={{
            strokeDasharray: circumference,
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
          <span className="text-xs text-muted-foreground">Complete</span>
        </div>
      )}
    </div>
  );
}
