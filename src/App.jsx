import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import HomeScreen from "./routes/HomeScreen";
import DrawFieldScreen from "./routes/DrawFieldScreen";
import CropPlannerScreen from "./routes/CropPlannerScreen";
import ResultsScreen from "./routes/ResultsScreen";
import MyLandsScreen from "./routes/MyLandsScreen";
import ComparativeDashboardScreen from "./routes/ComparativeDashboardScreen";
import LoginScreen from "./routes/LoginScreen";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/draw-field" element={<ProtectedRoute><DrawFieldScreen /></ProtectedRoute>} />
      <Route path="/crop-planner" element={<ProtectedRoute><CropPlannerScreen /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><ResultsScreen /></ProtectedRoute>} />
      <Route path="/my-lands" element={<ProtectedRoute><MyLandsScreen /></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><ComparativeDashboardScreen /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
