import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/LoginPage"; // specific path to your Login component
import CmuEntraIDCallback from "./cmuEntraIDCallback/page"; // specific path to your Callback component
import MePage from "./app/api/profile/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Login Page */}
        <Route path="/" element={<Login />} />
        
        {/* You MUST add this line for the white screen to go away */}
        <Route path="/cmuEntraIDCallback" element={<CmuEntraIDCallback />} />
        
        {/* The Profile Page */}
        <Route path="/me" element={<MePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;