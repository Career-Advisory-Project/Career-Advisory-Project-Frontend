import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
import AuthRedirect from "../pages/auth/AuthRedirect";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/redirect" element={<AuthRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
