import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Flame } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskContext } from '@/contexts/TaskContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { HeatmapCalendar } from '@/components/dashboard/HeatmapCalendar';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { ProgressRing } from '@/components/dashboard/ProgressRing';

export default function Analytics() {
  const { 
    tasks, 
    progress, 
    getDailyStats, 
    getWeeklyStats, 
    getMonthlyStats, 
    getOverallStreak 
  } = useTaskContext();

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentMonth = new Date();

  const dailyStats = getDailyStats(today);
  const monthlyStats = getMonthlyStats(currentMonth.getFullYear(), currentMonth.getMonth());
  const streak = getOverallStreak();

  // Calculate overall stats
  const totalCompleted = progress.filter(p => p.completed).length;
  const totalDaysWithTasks = new Set(progress.map(p => p.date)).size;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and see how you're improving over time
          </p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            subtitle="Active tasks"
            icon={Target}
            variant="primary"
            delay={0.1}
          />
          <StatCard
            title="Completed"
            value={totalCompleted}
            subtitle="All time completions"
            icon={TrendingUp}
            variant="success"
            delay={0.15}
          />
          <StatCard
            title="Active Days"
            value={totalDaysWithTasks}
            subtitle="Days with activity"
            icon={BarChart3}
            delay={0.2}
          />
          <StatCard
            title="Best Streak"
            value={`${streak} days`}
            subtitle="Current streak"
            icon={Flame}
            variant="warning"
            delay={0.25}
          />
        </div>

        {/* Progress Rings Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl glass"
        >
          <h3 className="text-lg font-semibold mb-6">Progress Overview</h3>
          
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <ProgressRing progress={dailyStats.rate} size={100} strokeWidth={8} />
              <p className="mt-3 text-sm font-medium">Today</p>
              <p className="text-xs text-muted-foreground">{dailyStats.completed}/{dailyStats.total}</p>
            </div>
            
            <div className="text-center">
              <ProgressRing 
                progress={monthlyStats.rate} 
                size={140} 
                strokeWidth={10} 
                variant="success"
              />
              <p className="mt-3 text-sm font-medium">This Month</p>
              <p className="text-xs text-muted-foreground">{monthlyStats.completed}/{monthlyStats.total}</p>
            </div>
            
            <div className="text-center">
              <ProgressRing 
                progress={totalDaysWithTasks > 0 ? (totalCompleted / Math.max(totalDaysWithTasks * tasks.length, 1)) * 100 : 0} 
                size={100} 
                strokeWidth={8}
              />
              <p className="mt-3 text-sm font-medium">All Time</p>
              <p className="text-xs text-muted-foreground">{totalCompleted} completions</p>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <WeeklyChart />
          <MonthlyBarChart />
        </div>

        {/* Heatmap */}
        <HeatmapCalendar />

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl glass"
        >
          <h3 className="text-lg font-semibold mb-4">Insights</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyStats.rate >= 100 && dailyStats.total > 0 && (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-success font-medium">🎉 Perfect Day!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've completed all your tasks today. Amazing!
                </p>
              </div>
            )}
            
            {streak >= 3 && (
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                <p className="text-warning font-medium">🔥 On Fire!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You're on a {streak}-day streak! Keep it going!
                </p>
              </div>
            )}
            
            {monthlyStats.rate >= 75 && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-primary font-medium">📈 Great Month!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've completed {Math.round(monthlyStats.rate)}% of your tasks this month.
                </p>
              </div>
            )}
            
            {tasks.length === 0 && (
              <div className="p-4 rounded-xl bg-secondary border border-border">
                <p className="font-medium">💡 Get Started</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first task to start tracking your progress!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
