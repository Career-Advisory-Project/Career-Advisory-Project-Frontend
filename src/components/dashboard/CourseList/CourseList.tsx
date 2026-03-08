import { useEffect, useState } from "react";
import { getDashboardCourses } from "../../../services/course.service";
import CourseItem from "../CourseItem/CourseItem";
import type { DashboardCourse } from "../../../types/course";
import { useNavigate } from "react-router-dom";

type Props = {
  cmuitaccount: string;
  onSelectCourse: (course: DashboardCourse | null) => void;
};

const CourseList = ({ cmuitaccount, onSelectCourse }: Props) => {
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getDashboardCourses(cmuitaccount);

        const mapped = result.courses;
        mapped.sort((a, b) => a.courseNo.localeCompare(b.courseNo));
        setCourses(mapped);
      } catch (err) {
        console.error("CourseList API error:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [cmuitaccount]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="h-auto lg:h-[calc(100vh-160px)] w-full lg:w-[360px] lg:min-w-[360px] lg:flex-shrink-0 bg-[#f6f4fb] rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-center font-bold text-[#5b4085] text-lg">
        Course List
      </h2>

      <div className="flex flex-col gap-4 overflow-auto">
        <>
          <div className="flex flex-col gap-3">
            {courses.map((course) => (
              <CourseItem
                key={course.courseNo}
                course={course}
                onClick={() => {
                  onSelectCourse(course);
                }}
              />
            ))}
          </div>
        </>
      </div>

      <button
        onClick={() => navigate("/addcourse")}
        className="mt-auto bg-[#5b4085] text-white font-semibold py-2 rounded-lg hover:bg-[#4a3370] transition"
      >
        Add Course
      </button>
    </div>
  );
};

export default CourseList;
