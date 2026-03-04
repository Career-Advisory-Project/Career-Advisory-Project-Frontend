import { useEffect, useState } from "react";
import { getDashboardCourses, getCourseDetail } from "../../../services/course.service";
import CourseItem from "../CourseItem/CourseItem";
import type { CourseDetail } from "../../../types/course";
import { useNavigate } from "react-router-dom";

type Props = {
  cmuitaccount: string;
  onSelectCourse: (course: CourseDetail | null) => void;
};

const CourseList = ({ cmuitaccount, onSelectCourse }: Props) => {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getDashboardCourses(cmuitaccount);
        // console.log("API data (dashboard courses):", result);

        // Fetch full details for each course in parallel
        const detailPromises = result.courses.map(async (c) => {
          try {
            const detail = await getCourseDetail(c.courseNo);
            const d = detail.course.courseDetails[0];
            if (d) {
              return d;
            }
          } catch (err) {
            console.warn(`Failed to fetch detail for ${c.courseNo}:`, err);
          }
          // Fallback if detail fetch fails
          return {
            courseNo: c.courseNo,
            courseNameEN: c.name,
            courseNameTH: "",
            detailEN: "Failed to load details",
            detailTH: "ไม่สามารถโหลดรายละเอียดได้",
            curCodeEN: "",
            curCodeTH: "",
            updatedYear: 0,
            updatedSemester: 0,
            credits: { credits: 0, lecture: 0, practice: 0, selfStudy: 0 },
            selectedTopicSubjects: [],
          } as CourseDetail;
        });

        const mapped = await Promise.all(detailPromises);
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
                  // console.log("Selected course:", course.courseNo);
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
