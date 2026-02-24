type SkillItemProps = {
  name: string;
  level: string | number;
};

const SkillItem: React.FC<SkillItemProps> = ({ name, level }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
      <span className="text-[#5b4085] font-semibold text-sm">{name}</span>
      <span className="text-gray-800 font-bold text-xs">Level {level}</span>
    </div>
  );
};

export default SkillItem;
