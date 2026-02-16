import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";
import CourseList from "../../components/dashboard/CourseList/CourseList";
import type { TeacherCourse } from "../../types/course";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(
    null
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex justify-center px-6 py-8">
        <div className="flex gap-6 max-w-[1200px] w-full items-stretch">
          <aside className="w-[360px] min-w-[360px] flex-shrink-0">
            <CourseList
              teacherId="63aa69183bb80ed3492d3083"
              onSelectCourse={setSelectedCourse}
            />
          </aside>

          <main className="flex-1">
            {selectedCourse ? (
              <CourseOverview course={selectedCourse} />
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
