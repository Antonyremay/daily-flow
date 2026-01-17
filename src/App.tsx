import { Routes, Route } from "react-router-dom";
import TodayView from "./pages/TodayView";
import WeeklyView from "./pages/WeeklyView";
import NewTask from "./pages/NewTask";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TodayView />} />
      <Route path="/weekly" element={<WeeklyView />} />
      <Route path="/new" element={<NewTask />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
