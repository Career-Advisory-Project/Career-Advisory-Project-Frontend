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

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} onToggleLang={toggleLang} />

      <div className="flex justify-center px-6 py-8">
        <div className="flex gap-6 max-w-[1200px] w-full items-stretch">
          <aside className="w-[360px] min-w-[360px] flex-shrink-0">
            <CourseList
              teacherId="61a82ed2e1d2b69f983664f9"
              lang={lang}
              onSelectCourse={setSelectedCourseId}
            />
          </aside>
          <main className="flex-1">
            {selectedCourseId ? (
              <CourseOverview lang={lang} courseId={selectedCourseId} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a course to view details
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
