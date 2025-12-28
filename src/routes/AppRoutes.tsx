import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
