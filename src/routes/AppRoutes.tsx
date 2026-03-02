import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
// import AuthRedirect from "../pages/auth/AuthRedirect";
import CmuEntraIDCallback from "../cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "../app/api/profile/page";
<<<<<<< HEAD
import AddCoursePage from "../pages/addcourse/addcourse";
import ConfigSkillPage from "../pages/configskill/configskill";
import EditSkillPage from "../pages/configskill/editskill";
=======
import AddCoursePage from "../pages/addcourse/AddCoursePage"; 
import ConfigSkillPage from "../pages/configskill/ConfigSkillPage";
import EditSkillPage from "../pages/configskill/editskill";
import CurriculumPage from "../pages/curriculum/CurriculumPage";
import CurriculumDetailPage from "../pages/curriculum/CurriculumDetailPage";
import CurriculumEditPage from "../pages/curriculum/CurriculumEditPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import TeacherList from "../pages/TeacherList/TeacherList";
import AdminList from "../pages/AdminList/AdminList";
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />

<<<<<<< HEAD
      {/* The Profile Page */}
      <Route path="/me" element={<MePage />} />

      <Route path="/addcourse" element={<AddCoursePage />} />
      <Route path="/configskill" element={<ConfigSkillPage />} />
      <Route path="/editskill" element={<EditSkillPage />} />
=======
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
      <Route path="/TeacherList" element={<ProtectedRoute><TeacherList /></ProtectedRoute>} />
      <Route path="/AdminList" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6
    </Routes>
  );
};

export default AppRoutes;
