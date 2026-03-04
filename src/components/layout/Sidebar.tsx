import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppContext } from "../../context/AppContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { lang, setLang } = useAppContext();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signOut", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "th" : "en");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-[#5b4085] font-bold italic text-2xl">
            Career Advisory
          </h1>
          <button
            onClick={toggleLang}
            className="mt-2 flex items-center gap-2 text-[#5b4085] font-medium hover:underline text-sm"
          >
            🌐 {lang === "en" ? "TH" : "EN"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-4 py-2 overflow-y-auto">
          {/* Admin-only section */}
          {isAdmin && (
            <>
              <button
                onClick={() => handleNavigate("/TeacherList")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/TeacherList")
                    ? "bg-[#f0ebf5] text-[#5b4085]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                User Manage
              </button>
              <button
                onClick={() => handleNavigate("/AdminList")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/AdminList")
                    ? "bg-[#f0ebf5] text-[#5b4085]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Admin Manage
              </button>
              <button
                onClick={() => handleNavigate("/admin/log")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/admin/log")
                    ? "bg-[#f0ebf5] text-[#5b4085]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Log
              </button>
          <button
            onClick={() => handleNavigate("/curriculum")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive("/curriculum")
                ? "bg-[#f0ebf5] text-[#5b4085]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Curriculum
          </button>
              <hr className="my-3 border-gray-200" />
            </>
          )}

          {/* Common items */}
          <button
            onClick={() => handleNavigate("/dashboard")}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-[#f0ebf5] text-[#5b4085]"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-8">
          <hr className="mb-4 border-gray-200" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
