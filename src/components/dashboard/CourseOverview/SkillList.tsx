import { useEffect, useState } from "react";
import type { SkillItem } from "../../../types/course";
import { getCourseSkillsByCourseNo } from "../../../services/course.service";
import { useAppContext } from "../../../context/AppContext";
import SkillRadarChart from "../../common/SkillRadarChart";

type Props = {
  courseNo: string;
};

const SkillList = ({ courseNo }: Props) => {
  const { lang } = useAppContext();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // useEffect(() => {
  //   if (skills.length > 0) {
  //     console.log(`Current Skills for ${courseNo}:`, skills);
  //   }
  // }, [skills, courseNo]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(false);

        const courseSkill = await getCourseSkillsByCourseNo(courseNo);
        setSkills(courseSkill?.skills ?? []);
      } catch (err) {
        console.error("Failed to load skills", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [courseNo]);

  if (loading) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        Loading skills...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-sm py-10">
        Failed to load skills.
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-10">
        {lang === "en"
          ? "No skills have been defined for this course yet."
          : "รายวิชานี้ยังไม่มีการกำหนดทักษะ"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Radar Chart */}
      <div className="mb-2">
        <SkillRadarChart skills={skills} />
      </div>

      {skills.map((skill) => {
        const sortedRubrics = [...skill.rubrics].sort((a, b) => b.level - a.level);

        return (
          <div key={skill.id} className="border border-gray-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#6a5acd] font-bold text-lg">
                {skill.name}
              </span>
            </div>

            {sortedRubrics.length > 0 ? (
              <div className="flex flex-nowrap gap-1.5 overflow-x-auto">
                {sortedRubrics.map((rubric) => (
                  <div
                    key={rubric.grade}
                    className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs whitespace-nowrap"
                  >
                    <span className="font-semibold text-[#5b4085]">
                      {rubric.grade}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-700">
                      Lv.{rubric.level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">No level assigned</span>
            )
            }
          </div>
        );
      })}
    </div>
  );
};

export default SkillList;
