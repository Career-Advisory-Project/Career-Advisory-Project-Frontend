
type CurriculumHeaderProps = {
  program: string;
  curriculum_year: string;
  onEdit?: () => void;
};

const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({
  program,
  curriculum_year,
  onEdit,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
      <h2 className="text-[#5b4085] font-bold text-2xl">
        {program} - {curriculum_year}
      </h2>
      <button
        onClick={onEdit}
        className="bg-[#5b4085] text-white px-10 py-2.5 rounded-lg hover:bg-[#4a3370] transition font-medium"
      >
        Edit
      </button>
    </div>
  );
};

export default CurriculumHeader;
