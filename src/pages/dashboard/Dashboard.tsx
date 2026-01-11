import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";
import CourseList from "../../components/dashboard/CourseList/CourseList";
import type { TeacherCourse } from "../../types/course";

const Dashboard = () => {
  const [lang, setLang] = useState<"en" | "th">(
    () => (localStorage.getItem("lang") as "en" | "th") || "en"
  );

  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(
    null
  );

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "th" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar lang={lang} onToggleLang={toggleLang} />

      <div className="flex justify-center px-6 py-8">
        <div className="flex gap-6 max-w-[1200px] w-full items-stretch">
          <aside className="w-[360px] min-w-[360px] flex-shrink-0">
            <CourseList
              teacherId="63aa69183bb80ed3492d3083"
              lang={lang}
              onSelectCourse={setSelectedCourse}
            />
          </aside>

          <main className="flex-1">
            {selectedCourse ? (
              <CourseOverview lang={lang} course={selectedCourse} />
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
