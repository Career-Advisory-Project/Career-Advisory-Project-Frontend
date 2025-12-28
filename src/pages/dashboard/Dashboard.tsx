import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";

const Dashboard = () => {
  const [lang, setLang] = useState<"en" | "th">(() => {
    return (localStorage.getItem("lang") as "en" | "th") || "en";
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "th" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  // TEMP: mock courseId until course selection is implemented
  return (
    <div className="min-h-screen">
      <Navbar lang={lang} onToggleLang={toggleLang} />
      <CourseOverview lang={lang} courseId="k5RZXfNFjcvTzM4B9xGZb" />
    </div>
  );
};

export default Dashboard;
