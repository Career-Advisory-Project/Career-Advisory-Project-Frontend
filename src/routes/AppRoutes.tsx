import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/LoginPage";
import Dashboard from "../pages/dashboard/Dashboard";
// import AuthRedirect from "../pages/auth/AuthRedirect";
import CmuEntraIDCallback from "../cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "../app/api/profile/page";

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
    </Routes>
  );
};

export default AppRoutes;
