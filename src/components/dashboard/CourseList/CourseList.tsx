import { useEffect, useState } from "react";
import { getTeacherCourses } from "../../../services/course.service";
import CourseItem from "../CourseItem/CourseItem";
import type { TeacherCourse } from "../../../types/course";

type Props = {
  teacherId: string;
  lang: "en" | "th";
};

const CourseList = ({ teacherId, lang }: Props) => {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getTeacherCourses(teacherId);
        console.log("API data (teacher courses):", result);
        setCourses(result.teacherCourse);
      } catch (err) {
        console.error("CourseList API error:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [teacherId]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="w-[360px] bg-[#f6f4fb] rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-center font-bold text-[#5b4085] text-lg">
        Course List
      </h2>

      <div className="flex flex-col gap-3">
        {courses.map((course) => (
          <CourseItem key={course.courseNo} course={course} lang={lang} />
        ))}
      </div>

      <button className="mt-auto bg-[#5b4085] text-white font-semibold py-2 rounded-lg hover:bg-[#4a3370] transition">
        Add Course
      </button>
    </div>
  );
};

export default CourseList;
