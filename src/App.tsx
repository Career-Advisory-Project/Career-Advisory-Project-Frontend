import "./assets/styles/global.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <div>Hello go /login or /dashboard to work on that page naja</div>
      <div>For Oat : go to src\pages\auth\LoginPage.tsx </div>
      <div>And src\assets\styles\Login.css for custom CSS</div>
      <div className="bg-green-500 text-white p-4">Tailwind v4 is working</div>
    </BrowserRouter>
  );
};

export default App;
