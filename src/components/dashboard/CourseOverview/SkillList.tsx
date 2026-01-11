import { useEffect, useState } from "react";
import type { SkillItem } from "../../../types/course";
import { getCourseSkills } from "../../../services/course.service";

type Props = {
  courseNo: string;
  lang: "en" | "th";
};

const SkillList = ({ courseNo, lang }: Props) => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const allCourseSkills = await getCourseSkills();

        const matched = allCourseSkills.find((c) => c.courseNo === courseNo);

        setSkills(matched?.skills ?? []);
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
      {skills.map((skill) => (
        <div key={skill.id} className="skill-card w-[669px] h-[53px]">
          <div className="flex justify-between items-center border-b pb-1">
            <span className="text-[#6a5acd] font-bold text-lg">
              {skill.name}
            </span>
            <span className="text-gray-800 font-bold text-sm">
              Level {skill.rubrics[0]?.level}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillList;
