import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseCard from "../../components/addcourse/CourseCard";
import SkillItem from "../../components/addcourse/SkillItem";
import SearchInput from "../../components/common/SearchInput";
import { getCourseSkills, getTeacherCourses } from "../../services/course.service";
import type { CourseSkillResponse } from "../../types/course";
import SkillRadarChart from "../../components/common/SkillRadarChart";
import { useNavigate } from "react-router-dom";

const AddCoursePage = () => {
  const [allCourses, setAllCourses] = useState<CourseSkillResponse[]>([]);
  const [viewedCourse, setViewedCourse] = useState<CourseSkillResponse | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all courses
        const data = await getCourseSkills();
        setAllCourses(data);

        // Fetch teacher's courses and pre-select them (purple)
        const teacherId = import.meta.env.VITE_EXAMPLE_TEACHER_ID;
        if (teacherId) {
          const teacherData = await getTeacherCourses(teacherId);
          const teacherCourseNos = (teacherData.courses || []).map(
            (c) => c.courseNo
          );
          setSelectedCourseIds(teacherCourseNos);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const handleToggleCourse = (course: CourseSkillResponse) => {
  //   setSelectedCourseIds(prev =>
  //     prev.includes(course.courseNo)
  //       ? prev.filter(id => id !== course.courseNo)
  //       : [...prev, course.courseNo]
  //   );
  // };

  const filteredCourses = allCourses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col ">
      <Navbar />
      
      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="flex gap-8 max-w-[1200px] w-full h-[80vh]">
          
          {/* LEFT: ALL COURSE LIST */}
          <div className="w-[60%] bg-white rounded-xl ps-8 pe-4 py-6 flex flex-col shadow-sm">
            <h2 className="text-center font-bold text-xl text-black mb-6">All Course</h2>

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
                    isChecked={selectedCourseIds.includes(course.courseNo)}
                    // onToggle={() => handleToggleCourse(course)}
                    onClick={() => setViewedCourse(course)}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: COURSE DETAIL & SKILLS */}
          <div className="w-[40%] flex flex-col">
              
            {/* White Container for Details */}
            <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col mb-4">
              {viewedCourse ? (
                <>
                  <h2 className="text-center text-[#5b4085] font-bold text-xl p-8">
                    {viewedCourse.name}
                  </h2>

                  <div className="bg-gray-100 rounded-lg p-6 flex-1 flex flex-col overflow-y-auto">
                    <h3 className="text-center font-bold text-[#5b4085] mb-4">{viewedCourse.skills.length === 0 ? "" : "Skill List"}</h3>

                    {/* Radar Chart */}
                    {viewedCourse.skills && viewedCourse.skills.length > 0 && (
                      <div className="mb-4">
                        <SkillRadarChart skills={viewedCourse.skills} />
                      </div>
                    )}
                    
                    <div className="space-y-3 flex-1">
                      {viewedCourse.skills && viewedCourse.skills.length > 0 ? (
                        viewedCourse.skills.map((skill, idx) => (
                          <SkillItem
                            key={idx}
                            name={skill.name}
                            level={skill.rubrics[0]?.level ?? "?"}
                          />
                        ))
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-black text-lg">No Skill Config</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a course to view details
                </div>
              )}
            </div>

            {/* Finish Button Area */}
            <div className="flex justify-end">
                <button 
                onClick={() => navigate('/dashboard')}
                className="bg-[#5b4085] text-white font-bold px-12 py-3 rounded-lg hover:bg-[#4a3370] transition shadow-md">
                  Finish
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
