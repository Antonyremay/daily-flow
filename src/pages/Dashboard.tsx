import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, subDays, addDays } from 'date-fns';
import { 
  CheckCircle2, 
  Target, 
  Flame, 
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '@/contexts/TaskContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { CheckboxMatrix } from '@/components/dashboard/CheckboxMatrix';
import { ProgressLineChart } from '@/components/charts/ProgressLineChart';
import { StatusBreakdownChart } from '@/components/charts/StatusBreakdownChart';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [matrixStartDate, setMatrixStartDate] = useState(() => subDays(new Date(), 7));
  
  const { 
    tasks, 
    getDailyStats, 
    getWeeklyStats, 
    getMonthlyStats, 
    getOverallStreak,
  } = useTaskContext();

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const currentMonth = new Date();

  const dailyStats = getDailyStats(today);
  const weeklyStats = getWeeklyStats(weekStart);
  const monthlyStats = getMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());
  const streak = getOverallStreak();

  const motivationalMessages = [
    { text: "Every day is a fresh start! 🌟", condition: true },
    { text: "Great consistency this week! 💪", condition: weeklyStats.rate >= 80 },
    { text: "You're improving compared to last week!", condition: weeklyStats.rate > 50 },
    { text: `Amazing ${streak}-day streak! Keep it going! 🔥`, condition: streak >= 3 },
    { text: "Consistency is your superpower!", condition: dailyStats.rate === 100 },
  ];

  const getMessage = () => {
    const validMessages = motivationalMessages.filter(m => m.condition);
    return validMessages[Math.floor(Math.random() * validMessages.length)]?.text || "Let's make today count!";
  };

  const handlePrevDays = () => {
    setMatrixStartDate(prev => subDays(prev, 7));
  };

  const handleNextDays = () => {
    setMatrixStartDate(prev => addDays(prev, 7));
  };

  const handleResetToToday = () => {
    setMatrixStartDate(subDays(new Date(), 7));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              <span className="gradient-text">Progress Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-warning" />
              {getMessage()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(), 'EEEE, MMM d')}</span>
            </div>
            <Link to="/new-task">
              <Button size="sm" className="bg-primary hover:bg-primary/90 glow-primary">
                <Plus className="w-4 h-4 mr-1" />
                New Task
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Today"
            value={`${Math.round(dailyStats.rate)}%`}
            subtitle={`${dailyStats.completed}/${dailyStats.total} tasks`}
            icon={Target}
            variant="primary"
            delay={0.1}
          />
          <StatCard
            title="This Week"
            value={`${Math.round(weeklyStats.rate)}%`}
            subtitle={`${weeklyStats.completed}/${weeklyStats.total} tasks`}
            icon={TrendingUp}
            variant="success"
            delay={0.15}
          />
          <StatCard
            title="This Month"
            value={`${Math.round(monthlyStats.rate)}%`}
            subtitle={`${monthlyStats.completed}/${monthlyStats.total} tasks`}
            icon={CheckCircle2}
            delay={0.2}
          />
          <StatCard
            title="Streak"
            value={`${streak}`}
            subtitle={streak > 0 ? "days strong! 🔥" : "Start today!"}
            icon={Flame}
            variant="warning"
            delay={0.25}
          />
        </div>

        {/* Calendar Checkbox Matrix - Primary Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Daily Progress Matrix</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevDays}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToToday}
                className="text-xs"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextDays}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CheckboxMatrix startDate={matrixStartDate} days={21} />
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Ring + Quick Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl glass"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Overall Progress
            </h3>
            
            <div className="flex flex-col items-center">
              <ProgressRing progress={monthlyStats.rate} size={180} strokeWidth={14} />
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-foreground">Goal: 100%</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {monthlyStats.completed === monthlyStats.total && monthlyStats.total > 0
                    ? "🎉 Perfect month!"
                    : `${monthlyStats.total - monthlyStats.completed} tasks to go`}
                </p>
              </div>

              {/* Streak Badge */}
              {streak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="mt-4 px-4 py-2 rounded-full bg-warning/20 border border-warning/30 flex items-center gap-2"
                >
                  <Flame className="w-5 h-5 text-warning" />
                  <span className="font-semibold text-warning">{streak} Day Streak!</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Daily Progress Line Chart */}
          <div className="lg:col-span-2">
            <ProgressLineChart days={14} />
          </div>
        </div>

        {/* Status Breakdown */}
        <StatusBreakdownChart />

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first task to start tracking your progress!
            </p>
            <Link to="/new-task">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Task
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
