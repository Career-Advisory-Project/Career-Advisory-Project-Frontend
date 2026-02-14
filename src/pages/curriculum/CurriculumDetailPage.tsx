import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import CurriculumHeader from "../../components/curriculum/CurriculumHeader";
import SkillList from "../../components/curriculum/SkillList";
import CourseListTab from "../../components/curriculum/CourseListTab";
import {
  getCurriculumSkills,
  getCurriculumCourses,
} from "../../services/curriculum.service";
import type { Skill, Course } from "../../types/curriculum";

const CurriculumDetailPage = () => {
  const { program, curriculum_year } = useParams<{ program: string; curriculum_year: string }>();

  const [activeTab, setActiveTab] = useState<"skills" | "courses">("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-sm p-8 flex flex-col">
          <CurriculumHeader
            program={decodeURIComponent(program)}
            curriculum_year={curriculum_year}
            onEdit={() => console.log("Edit clicked")}
          />

          {/* TABS */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-8 py-3 font-bold text-sm transition-colors relative ${
                activeTab === "skills"
                  ? "text-[#5b4085] bg-[#EBEAED]" // Selected style
                  : "text-gray-500 hover:text-gray-700 bg-gray-100" // Unselected style
              }`}
            >
              Skill List
              {/* Purple active bar handled by bg color, but let's match exact design if needed */}
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-8 py-3 font-bold text-sm transition-colors ${
                activeTab === "courses"
                  ? "text-[#5b4085] bg-[#EBEAED]"
                  : "text-gray-500 hover:text-gray-700 bg-gray-100"
              }`}
            >
              Course List
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
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
