import type { Curriculum } from "../../types/curriculum";

type CurriculumCardProps = {
  curriculum: Curriculum;
  onClick?: () => void;
};

const CurriculumCard: React.FC<CurriculumCardProps> = ({
  curriculum,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 bg-[#f5f4f7] rounded-lg cursor-pointer hover:bg-[#eceaf0] transition"
    >
      <span className="text-[#5b4085] font-bold text-sm min-w-0 truncate">
        {curriculum.program}
      </span>
      <span className="font-bold text-sm text-gray-800 whitespace-nowrap">
        {curriculum.curriculum_year}
      </span>
      <span className="text-sm text-gray-600 whitespace-nowrap">
        {curriculum.total_courses} Courses
      </span>
      <span className="text-sm text-gray-600 whitespace-nowrap">
        {curriculum.total_skills} Skills
      </span>
    </div>
  );
};

export default CurriculumCard;
