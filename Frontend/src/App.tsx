import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProutedRoute";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>

        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>

        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
