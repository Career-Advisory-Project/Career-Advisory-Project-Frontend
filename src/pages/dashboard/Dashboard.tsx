import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";
import CourseOverview from "../../components/dashboard/CourseOverview/CourseOverview";
import CourseList from "../../components/dashboard/CourseList/CourseList";
import type { TeacherCourse } from "../../types/course";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(
    null
  );
  const [cmuitaccount, setCmuitaccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/me");
        if (response.data.ok && response.data.user) {
          setCmuitaccount(response.data.user.cmuitaccount);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  if (!cmuitaccount) {
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

      <div className="flex justify-center px-6 py-8">
        <div className="flex gap-6 max-w-[1200px] w-full items-stretch">
          <aside className="w-[360px] min-w-[360px] flex-shrink-0">
            <CourseList
              cmuitaccount={cmuitaccount}
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
