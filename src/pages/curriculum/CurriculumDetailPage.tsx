import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CurriculumHeader from "../../components/curriculum/CurriculumHeader";
import SkillList from "../../components/curriculum/SkillListTab";
import CourseListTab from "../../components/curriculum/CourseListTab";
import {
  getCurriculumSkills,
  getCurriculumCourses,
} from "../../services/curriculum.service";
import type { Skill, Course } from "../../types/curriculum";
import { useAppContext } from "../../context/AppContext";

const CurriculumDetailPage = () => {
  const { program, curriculum_year } = useParams<{ program: string; curriculum_year: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"skills" | "courses">("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useAppContext();

  useEffect(() => {
    if (!program || !curriculum_year) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "skills") {
          const data = await getCurriculumSkills(program, curriculum_year);
          setSkills(data.skill_list || []);
        } else {
          const data = await getCurriculumCourses(program, curriculum_year);
          setCourses(data.course_list || []);
        }
      } catch (error) {
        console.error("Failed to fetch curriculum details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program, curriculum_year, activeTab]);

  if (!program || !curriculum_year) return null;

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-8 overflow-hidden">
        <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-sm p-6 sm:p-8 flex flex-col overflow-hidden">
          <CurriculumHeader
            program={decodeURIComponent(program)}
            curriculum_year={curriculum_year}
            onEdit={() =>
              navigate(
                `/curriculum/${program}/${curriculum_year}/edit`
              )
            }
          />
          <p className="w-full text-left font-light mb-4">
            {lang === "en" 
              ? "A summary of all courses and skills within this program. Use the edit button to modify the curriculum." 
              : "สรุปรายวิชาและทักษะทั้งหมดภายในหลักสูตรนี้ คุณสามารถใช้ปุ่มแก้ไขเพื่อปรับปรุงข้อมูลหลักสูตร"}
          </p>
          {/* TABS — connected to content below */}
          <div className="flex">
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-8 py-3 font-bold text-sm transition-colors ${
                activeTab === "skills"
                  ? "bg-[#5b4085] text-white"
                  : "bg-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              Skill List
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-8 py-3 font-bold text-sm transition-colors ${
                activeTab === "courses"
                  ? "bg-[#5b4085] text-white"
                  : "bg-gray-200 text-gray-600 hover:text-gray-800"
              }`}
            >
              Course List
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : activeTab === "skills" ? (
              <SkillList skills={skills} />
            ) : (
              <CourseListTab courses={courses} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailPage;
