import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CourseCard from "../../components/addcourse/CourseCard";
import SkillItem from "../../components/addcourse/SkillItem";
import SearchInput from "../../components/common/SearchInput";
import {
  getCurriculumCourses,
  addCoursesToCurriculum,
  removeCoursesFromCurriculum,
} from "../../services/curriculum.service";
import { getAllCourses, getCourseSkillsByCourseNo } from "../../services/course.service";
import type { CourseInfo, CourseSkillResponse } from "../../types/course";
import type { Course } from "../../types/curriculum";
import SkillRadarChart from "../../components/common/SkillRadarChart";

const CurriculumEditPage = () => {
  const { program, curriculum_year } = useParams<{
    program: string;
    curriculum_year: string;
  }>();
  const navigate = useNavigate();

  const curriculumName = program ? decodeURIComponent(program) : "";
  const startYear = curriculum_year ?? "";

  // All courses from the system
  const [allCourses, setAllCourses] = useState<CourseInfo[]>([]);
  // Initial course numbers that were in the curriculum when the page loaded
  const [initialCourseNos, setInitialCourseNos] = useState<string[]>([]);
  // Currently selected/toggled course numbers
  const [selectedCourseNos, setSelectedCourseNos] = useState<string[]>([]);
  // Course being viewed in the right panel
  const [viewedCourse, setViewedCourse] = useState<CourseSkillResponse | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!program || !curriculum_year) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllCourses();
        setAllCourses(data.courses);

        // Fetch courses already in this curriculum
        const currData = await getCurriculumCourses(program, curriculum_year);
        const currCourseNos = (currData.course_list || []).map(
          (c: Course) => c.courseNo
        );
        setInitialCourseNos(currCourseNos);
        setSelectedCourseNos(currCourseNos);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program, curriculum_year]);

  const handleToggleCourse = (course: CourseInfo) => {
    setSelectedCourseNos((prev) =>
      prev.includes(course.courseNo)
        ? prev.filter((no) => no !== course.courseNo)
        : [...prev, course.courseNo]
    );
  };

  const handleCourseClick = async (course: CourseInfo) => {
    try {
      const courseDetail = await getCourseSkillsByCourseNo(course.courseNo);
      setViewedCourse(courseDetail);
    } catch (error) {
      console.error("Failed to fetch course skills:", error);
    }
  };

  const handleFinish = async () => {
    if (!program || !curriculum_year) return;

    // Compute diff: which courses were added and which were removed
    const coursesToAdd = selectedCourseNos.filter(
      (no) => !initialCourseNos.includes(no)
    );
    const coursesToRemove = initialCourseNos.filter(
      (no) => !selectedCourseNos.includes(no)
    );

    setSaving(true);
    try {
      const promises: Promise<unknown>[] = [];

      // POST: Add newly checked courses
      if (coursesToAdd.length > 0) {
        promises.push(addCoursesToCurriculum(curriculum_year, program, coursesToAdd));
      }

      // DELETE: Remove newly unchecked courses
      if (coursesToRemove.length > 0) {
        promises.push(removeCoursesFromCurriculum(
          curriculum_year,
          program,
          coursesToRemove
        ));
      }

      await Promise.all(promises);

      // Navigate back to detail page on success
      navigate(`/curriculum/${program}/${curriculum_year}`);
    } catch (error) {
      console.error("Failed to save curriculum changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filteredCourses = allCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!program || !curriculum_year) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center px-6 py-8 gap-6">
        {/* TOP: Form Fields */}
        <div className="max-w-[1200px] w-full bg-white rounded-xl shadow-sm p-8">
          <div className="mb-4">
            <label className="text-[#5b4085] font-bold text-sm block mb-2">
              Curriculum Name
            </label>
            <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
              {curriculumName}
            </div>
          </div>
          <div>
            <label className="text-[#5b4085] font-bold text-sm block mb-2">
              Start Year
            </label>
            <div className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-700">
              {startYear}
            </div>
          </div>
        </div>

        {/* BOTTOM: Two-Column Layout */}
        <div className="flex gap-8 max-w-[1200px] w-full h-[90vh]">
          {/* LEFT: All Course List */}
          <div className="w-[45%] bg-white rounded-xl ps-8 pe-4 py-6 flex flex-col shadow-sm">
            <h2 className="text-center font-bold text-xl text-black mb-6">
              All Course
            </h2>

            <SearchInput
              placeholder="Search Course ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading courses...
                </div>
              ) : (
                filteredCourses.map((course, index) => (
                  <CourseCard
                    key={index}
                    courseNo={course.courseNo}
                    name={course.name}
                    isChecked={selectedCourseNos.includes(course.courseNo)}
                    onToggle={() => handleToggleCourse(course)}
                    onClick={() => handleCourseClick(course)}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Course Detail & Skills */}
          <div className="w-[55%] flex flex-col">
            <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col mb-4">
              {viewedCourse ? (
                <>
                  <h2 className="text-center text-[#5b4085] font-bold text-xl p-8">
                    {viewedCourse.name}
                  </h2>

                  <div className="bg-gray-100 rounded-lg p-6 flex-1 flex flex-col">
                    <h3 className="text-center font-bold text-[#5b4085] mb-4">
                       {viewedCourse.skills.length === 0 ? "No Skill Config" : "Skill List"}
                    </h3>

                    {/* Radar Chart */}
                    {viewedCourse.skills && viewedCourse.skills.length > 0 && (
                      <div className="mb-4">
                        <SkillRadarChart skills={viewedCourse.skills} />
                      </div>
                    )}

                    {/* <div className="space-y-3 flex-1">
                      {viewedCourse.skills && viewedCourse.skills.length > 0 ? (
                        viewedCourse.skills.map((skill, idx) => (
                          <SkillItem
                            key={idx}
                            name={skill.name}
                            level={
                              skill.rubrics[0]?.level ?? "?"
                            }
                          />
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-black text-lg">No Skill Config</p>
                        </div>
                      )}
                    </div> */}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a course to view details
                </div>
              )}
            </div>

            {/* Finish Button */}
            <div className="flex justify-end">
              <button
                onClick={handleFinish}
                disabled={saving}
                className="bg-[#5b4085] text-white font-bold px-12 py-3 rounded-lg hover:bg-[#4a3370] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Finish"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumEditPage;
