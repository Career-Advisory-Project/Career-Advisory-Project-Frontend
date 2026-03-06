import { useState, useEffect, useRef } from "react";
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

const CurriculumDetailPage = () => {
  const { program, curriculum_year } = useParams<{ program: string; curriculum_year: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"skills" | "courses">("skills");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
        setSelectedYear(null); // reset filter on tab/data change
      } catch (error) {
        console.error("Failed to fetch curriculum details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [program, curriculum_year, activeTab]);

const availableYears = Array.from(
  new Set(courses.map((c) => c.recommendYear).filter(Boolean))
).sort();

  const filteredCourses = selectedYear
    ? courses.filter((c) => c.recommendYear === selectedYear)
    : courses;

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

          {/* TABS + FILTER ROW */}
          <div className="flex items-center justify-between">
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

            {/* Year Filter Dropdown */}
            {activeTab === "courses" && (
            <div className="relative mb-2 mr-4" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedYear
                    ? "bg-[#5b4085] text-white border-[#5b4085]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#5b4085] hover:text-[#5b4085]"
                }`}
              >
                {/* Filter icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 9.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-7.586L3.293 5.707A1 1 0 013 5V3z" clipRule="evenodd" />
                </svg>
                {selectedYear ? (selectedYear === "-" ? "Not specified" : `Year ${selectedYear}`) : "Filter by Year"}
                {/* Chevron */}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => { setSelectedYear(null); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      !selectedYear
                        ? "bg-[#f3eeff] text-[#5b4085] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All Years
                  </button>
                  {availableYears.length > 0 ? (
                    availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => { setSelectedYear(year); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedYear === year
                            ? "bg-[#f3eeff] text-[#5b4085] font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {year === "-" ? "Not specified" : `Year ${year}`}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400 italic">No years available</div>
                  )}
                </div>
              )}
            </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : activeTab === "skills" ? (
              <SkillList skills={skills} />
            ) : (
              <CourseListTab courses={filteredCourses} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumDetailPage;
