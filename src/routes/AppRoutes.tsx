import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
// import AuthRedirect from "../pages/auth/AuthRedirect";
import CmuEntraIDCallback from "../cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "../app/api/profile/page";
import AddCoursePage from "../pages/addcourse/addcourse";
import ConfigSkillPage from "../pages/configskill/configskill";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />

      {/* The Profile Page */}
      <Route path="/me" element={<MePage />} />

      <Route path="/addcourse" element={<AddCoursePage />} />
      <Route path="/configskill" element={<ConfigSkillPage />} />
    </Routes>
  );
};

export default AppRoutes;
