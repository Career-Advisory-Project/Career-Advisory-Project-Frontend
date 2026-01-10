import { useState, useEffect } from "react";
import { getCourseOverview } from "../../../services/course.service";
import type { CourseOverviewResponse, SkillItem } from "../../../types/course";
import "../../../assets/styles/dashboard.css";
import ConfigSkillModal from "./ConfigSkillModal";

type Props = {
  lang: "en" | "th";
  courseId: string;
};

const CourseOverview = ({ lang, courseId }: Props) => {
  const [data, setData] = useState<CourseOverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Config Skill UI state
  const [editableSkills, setEditableSkills] = useState<SkillItem[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    console.log("Fetching course overview for:", courseId);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const result = await getCourseOverview(courseId);
        console.log("Course from API:", result.course.courseNo);
        console.log("Full result:", result);

        // setData(result);

        // 🔹 copy skills for editing
        const rawSkillList = Array.isArray(result.skillList)
          ? result.skillList
          : result.skillList
          ? [result.skillList]
          : [];

        const normalizedSkills = rawSkillList.map((skill) => ({
          ...skill,
          selectedLevel: skill.rubrics?.[0]?.level ?? 1,
        }));

        setEditableSkills(normalizedSkills);
        setData({ ...result, skillList: normalizedSkills });
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const title = loading
    ? "Loading..."
    : error
    ? "—"
    : lang === "en"
    ? data?.course?.courseNameEN ?? "—"
    : data?.course?.courseNameTH ?? "—";
  const detail = loading
    ? "Loading course details..."
    : error
    ? "Failed to load course details."
    : lang === "en"
    ? data?.course?.detailEN
    : data?.course?.detailTH;

  return (
    <>
      <div className="flex items-center justify-end font-['CMU']">
        <div className="dashboard-card w-[819px] h-[793px]">
          <div className="text-center mb-6">
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm">
              Course Overview
            </h2>

            {/* CourseName */}
            <h1 className="text-[#5b4085] font-bold mt-1 !text-[30px]">
              {title}
            </h1>

            <hr className="border-gray-300 w-[718px] my-4 mx-auto" />
          </div>

          <div className="dashboard-panel w-[719px] h-[234px] mx-auto">
            {/* courseDetail */}
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              {detail}
            </p>
          </div>

          {/* skillList */}
          <div className="dashboard-panel w-[719px] min-h-[341px] mt-3 mx-auto">
            <h3 className="text-center text-[#5b4085] text-xl font-bold mb-4">
              Skill List
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center text-gray-400 text-sm py-10">
                  Loading skills...
                </div>
              ) : error ? (
                <div className="text-center text-red-500 text-sm py-10">
                  Failed to load skills.
                </div>
              ) : editableSkills.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-10">
                  {lang === "en"
                    ? "No skills have been defined for this course yet."
                    : "รายวิชานี้ยังไม่มีการกำหนดทักษะ"}
                </div>
              ) : (
                editableSkills.map((skill: SkillItem) => (
                  <div
                    key={`${skill.no}-${skill.name}`}
                    className="skill-card w-[669px] h-[53px]"
                  >
                    <div className="flex justify-between items-center border-b-1 border-gray-300 pb-1">
                      <span className="text-[#6a5acd] font-bold text-lg">
                        {skill.name}
                      </span>
                      <span className="text-gray-800 font-bold text-sm">
                        Level {skill.selectedLevel}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end mt-3 px-4">
            <button
              disabled={editableSkills.length === 0}
              onClick={() => setIsConfigOpen(true)}
              className={`font-bold py-2 px-8 rounded shadow-md transition-colors duration-200 w-[232px] h-[50px]
                  ${
                    editableSkills.length === 0
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-[#5b4085] hover:bg-[#4a3370] text-white"
                  }
                `}
            >
              Config Skill
            </button>
          </div>
        </div>
      </div>

      <ConfigSkillModal
        open={isConfigOpen}
        skills={editableSkills}
        lang={lang}
        onClose={() => setIsConfigOpen(false)}
        onSave={(updatedSkills) => {
          // update local editable state
          setEditableSkills(updatedSkills);

          // sync back to course data (frontend-only)
          setData((prev) =>
            prev ? { ...prev, skillList: updatedSkills } : prev
          );

          setIsConfigOpen(false);

          console.log("Updated skills (frontend only):", updatedSkills);
        }}
      />
    </>
  );
};

export default CourseOverview;
