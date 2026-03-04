type Rubric = {
  grade: string;
  level: number;
};

type SkillItemProps = {
  name: string;
  level?: string | number;
  rubrics?: Rubric[];
};

const SkillItem: React.FC<SkillItemProps> = ({ name, rubrics }) => {
  const sortedRubrics = rubrics
    ? [...rubrics].sort((a, b) => b.level - a.level)
    : [];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#6a5acd] font-bold text-lg">{name}</span>
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
              <span className="text-gray-700">Lv.{rubric.level}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-gray-400 text-sm">No level assigned</span>
      )}
    </div>
  );
};

export default SkillItem;
