import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
// import AuthRedirect from "../pages/auth/AuthRedirect";
import CmuEntraIDCallback from "../cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "../app/api/profile/page";
import AddCoursePage from "../pages/addcourse/addcourse";
import ConfigSkillPage from "../pages/configskill/configskill";
import TeacherList from "../pages/TeacherList/TeacherList";
import AdminList from "../pages/AdminList/AdminList";
import AddTeacherToList from "../pages/AddTeacherToList/AddTeacherToList";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/auth/redirect" element={<AuthRedirect />} /> */}
      {/* The Login Page */}
      <Route path="/" element={<Login />} />

      {/* You MUST add this line for the white screen to go away */}
      <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />

      {/* The Profile Page */}
      <Route path="/me" element={<MePage />} />

      <Route path="/addcourse" element={<AddCoursePage />} />
      <Route path="/configskill" element={<ConfigSkillPage />} />
      <Route path="/TeacherList" element={<TeacherList />} />
      <Route path="/AdminList" element={<AdminList />} />
      <Route path="/AddTeacherToList" element={<AddTeacherToList />} />
    </Routes>
  );
};

export default AppRoutes;
