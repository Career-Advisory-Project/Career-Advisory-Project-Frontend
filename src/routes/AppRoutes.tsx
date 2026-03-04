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
import AdminRoute from "../components/auth/AdminRoute";
import TeacherList from "../pages/TeacherList/TeacherList";
import AdminList from "../pages/AdminList/AdminList";
import LogPage from "../pages/Log/LogPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/me" element={<AdminRoute><MePage /></AdminRoute>} />
      <Route path="/addcourse" element={<ProtectedRoute><AddCoursePage /></ProtectedRoute>} />
      <Route path="/configskill" element={<ProtectedRoute><ConfigSkillPage /></ProtectedRoute>} />
      <Route path="/editskill" element={<ProtectedRoute><EditSkillPage /></ProtectedRoute>} />
      <Route path="/curriculum" element={<AdminRoute><CurriculumPage /></AdminRoute>} />
      <Route
        path="/curriculum/:program/:curriculum_year"
        element={<AdminRoute><CurriculumDetailPage /></AdminRoute>}
      />
      <Route
        path="/curriculum/:program/:curriculum_year/edit"
        element={<AdminRoute><CurriculumEditPage /></AdminRoute>}
      />

      {/* Admin-only routes */}
      <Route path="/TeacherList" element={<AdminRoute><TeacherList /></AdminRoute>} />
      <Route path="/AdminList" element={<AdminRoute><AdminList /></AdminRoute>} />
      <Route path="/admin/log" element={<AdminRoute><LogPage /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;
