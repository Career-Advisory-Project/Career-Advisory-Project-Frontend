import { useEffect, useState } from "react";
import { getTeacherCourses } from "../../../services/course.service";
import CourseItem from "../CourseItem/CourseItem";
import type { TeacherCourse } from "../../../types/course";
import { useAppContext } from "../../../context/AppContext";

const MOCK_NO_SKILL_COURSE: TeacherCourse = {
  courseNo: "__MOCK_NO_SKILL__",
  descENG: "This is descENG",
  descTH: "นี่คือ descTH",
  name: "Phantom Course",
};

type Props = {
  teacherId: string;
  // onSelectCourse: (courseId: string | null) => void;
  onSelectCourse: (course: TeacherCourse | null) => void;
};

const CourseList = ({ teacherId, onSelectCourse }: Props) => {
  const { lang } = useAppContext();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getTeacherCourses(teacherId);
        console.log("API data (teacher courses):", result);
        // setCourses(result.teacherCourse);
        setCourses([
          ...result.courses,
          MOCK_NO_SKILL_COURSE, // 👈 TEMP MOCK
        ]);
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

  const unfinishedCourses = courses.filter(
    (course) => course.courseNo === "__MOCK_NO_SKILL__"
  );

  const finishedCourses = courses.filter(
    (course) => course.courseNo !== "__MOCK_NO_SKILL__"
  );

  return (
    <div className="h-full w-[360px] min-w-[360px] flex-shrink-0 bg-[#f6f4fb] rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-center font-bold text-[#5b4085] text-lg">
        Course List
      </h2>

      <div className="flex flex-col gap-4">
        {/* ===== UNFINISHED ===== */}
        {unfinishedCourses.length > 0 && (
          <>
            <h3 className="text-center text-[#5b4085] italic font-semibold border-b">
              {lang === "en" ? "Unfinished" : "ยังไม่เสร็จ"}
            </h3>

            <div className="flex flex-col gap-3">
              {unfinishedCourses.map((course) => (
                <CourseItem
                  key={course.courseNo}
                  course={course}
                  onClick={() => {
                    onSelectCourse(course);
                    console.log("Selected unfinished course:", course.courseNo);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ===== FINISHED ===== */}
        {finishedCourses.length > 0 && (
          <>
            <h3 className="text-center text-[#5b4085] italic font-semibold border-b">
              {lang === "en" ? "Finished" : "เสร็จสิ้นแล้ว"}
            </h3>

            <div className="flex flex-col gap-3">
              {finishedCourses.map((course) => (
                <CourseItem
                  key={course.courseNo}
                  course={course}
                  onClick={() => {
                    onSelectCourse(course);
                    console.log("Selected finished course:", course.courseNo);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <button className="mt-auto bg-[#5b4085] text-white font-semibold py-2 rounded-lg hover:bg-[#4a3370] transition">
        Add Course
      </button>
    </div>
  );
};

export default CourseList;
