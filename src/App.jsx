import { Navigate, Route, Routes } from "react-router-dom";
import HomeScreen from "./routes/HomeScreen";
import DrawFieldScreen from "./routes/DrawFieldScreen";
import CropPlannerScreen from "./routes/CropPlannerScreen";
import ResultsScreen from "./routes/ResultsScreen";
import MyLandsScreen from "./routes/MyLandsScreen";
import ComparativeDashboardScreen from "./routes/ComparativeDashboardScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/draw-field" element={<DrawFieldScreen />} />
      <Route path="/crop-planner" element={<CropPlannerScreen />} />
      <Route path="/results" element={<ResultsScreen />} />
      <Route path="/my-lands" element={<MyLandsScreen />} />
      <Route path="/compare" element={<ComparativeDashboardScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
