import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
  const { lang } = useAppContext();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="relative w-full h-[72px] flex items-center justify-between px-4 sm:px-6 bg-white border-b border-[#5b4085] shadow-sm">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-[#5b4085] transition-colors p-1"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#5b4085] font-bold italic text-lg bg-transparent border-none cursor-pointer"
          >
            Career Advisory
          </button>
        </div>

        {/* Right: User info */}
        <div
          onClick={() => navigate("/me")}
          className="text-gray-700 font-medium z-10 cursor-pointer"
        >
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : user ? (
          <div className="flex flex-col items-end leading-tight">
            {lang === "th"
              ? `${user.firstname_TH} ${user.lastname_TH}`
              : `${user.firstname_EN} ${user.lastname_EN}`}
            <span className="text-xs text-gray-500">
              {user.itaccounttype_EN}
            </span>
          </div>
          ) : (
            <a href="/" className="text-blue-600 hover:underline">
              Sign In
            </a>
          )}
        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
