import type { Skill } from "../../types/curriculum";

type SkillListProps = {
  skills: Skill[];
};

const SkillList: React.FC<SkillListProps> = ({ skills }) => {
  return (
    <div className="bg-gray-100 p-6 space-y-3">
      {skills.map((skill) => (
        <div
          key={skill.skillID}
          className="bg-white rounded shadow-sm p-4 w-full"
        >
          <div className="flex justify-between items-center border-b pb-1">
            <span className="text-[#6a5acd] font-bold text-sm">
              {skill.name}
            </span>
            <span className="text-gray-800 font-bold text-sm">
              Maximum Level {skill.max_level}
            </span>
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No skills found
        </div>
      )}
    </div>
  );
};

export default SkillList;
