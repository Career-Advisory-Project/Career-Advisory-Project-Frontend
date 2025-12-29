import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";
import CourseList from "../../components/dashboard/CourseList/CourseList";

const Dashboard = () => {
  const [lang, setLang] = useState<"en" | "th">(() => {
    return (localStorage.getItem("lang") as "en" | "th") || "en";
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "th" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  useEffect(() => {
    console.log("Dashboard selectedCourseId:", selectedCourseId);
  }, [selectedCourseId]);
  // TEMP: mock courseId until course selection is implemented
  return (
    <div className="min-h-screen">
      <Navbar lang={lang} onToggleLang={toggleLang} />
      <div className="flex gap-6 p-6">
        <CourseList
          teacherId="teacher123"
          lang={lang}
          onSelectCourse={setSelectedCourseId}
        />
        {selectedCourseId ? (
          <CourseOverview lang={lang} courseId={selectedCourseId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a course to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
