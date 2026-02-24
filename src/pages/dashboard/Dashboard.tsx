import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";
import CourseList from "../../components/dashboard/CourseList/CourseList";
import type { CourseDetail } from "../../types/course";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<CourseDetail | null>(
    null
  );
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh] text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh] text-red-500">
          Unable to load user information. Please sign in again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex justify-center px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px] w-full items-stretch">
          <aside className="w-full lg:w-[360px] lg:min-w-[360px] lg:flex-shrink-0">
            <CourseList
              cmuitaccount={user.cmuitaccount}
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
