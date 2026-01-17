import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/contexts/TaskContext";
import Dashboard from "./pages/Dashboard";
import TodayView from "./pages/TodayView";
import WeeklyView from "./pages/WeeklyView";
import Analytics from "./pages/Analytics";
import NewTask from "./pages/NewTask";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TaskProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayView />} />
            <Route path="/weekly" element={<WeeklyView />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/new-task" element={<NewTask />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
