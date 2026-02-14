import type { Skill } from "../../types/curriculum";

type SkillListProps = {
  skills: Skill[];
};

const SkillList: React.FC<SkillListProps> = ({ skills }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-3">
      {skills.map((skill) => (
        <div
          key={skill.skillID}
          className="bg-white px-6 py-4 rounded-md flex justify-between items-center shadow-sm"
        >
          <span className="text-[#5b4085] font-bold text-lg">{skill.name}</span>
          <span className="text-black font-bold text-sm">
            Maximum Level {skill.max_level}
          </span>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">No skills found</div>
      )}
    </div>
  );
};

export default SkillList;
