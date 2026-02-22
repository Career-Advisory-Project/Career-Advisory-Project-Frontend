import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
// import AuthRedirect from "../pages/auth/AuthRedirect";
import CmuEntraIDCallback from "../cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "../app/api/profile/page";
import AddCoursePage from "../pages/addcourse/AddCoursePage"; 
import ConfigSkillPage from "../pages/configskill/ConfigSkillPage";
import EditSkillPage from "../pages/configskill/editskill";
import CurriculumPage from "../pages/curriculum/CurriculumPage";
import CurriculumDetailPage from "../pages/curriculum/CurriculumDetailPage";
import CurriculumEditPage from "../pages/curriculum/CurriculumEditPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/me" element={<ProtectedRoute><MePage /></ProtectedRoute>} />
      <Route path="/addcourse" element={<ProtectedRoute><AddCoursePage /></ProtectedRoute>} />
      <Route path="/configskill" element={<ProtectedRoute><ConfigSkillPage /></ProtectedRoute>} />
      <Route path="/editskill" element={<ProtectedRoute><EditSkillPage /></ProtectedRoute>} />
      <Route path="/curriculum" element={<ProtectedRoute><CurriculumPage /></ProtectedRoute>} />
      <Route
        path="/curriculum/:program/:curriculum_year"
        element={<ProtectedRoute><CurriculumDetailPage /></ProtectedRoute>}
      />
      <Route
        path="/curriculum/:program/:curriculum_year/edit"
        element={<ProtectedRoute><CurriculumEditPage /></ProtectedRoute>}
      />
    </Routes>
  );
};

export default AppRoutes;
