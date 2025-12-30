import React from "react";
import type { SkillItem } from "../../../types/course";

type Props = {
  open: boolean;
  skills: SkillItem[];
  lang: "en" | "th";
  onClose: () => void;
  onSave: (updatedSkills: SkillItem[]) => void;
};

const ConfigSkillModal = ({ open, skills, lang, onClose, onSave }: Props) => {
  if (!open) return null;

  const updateSkillLevel = (
    index: number,
    level: number,
    setLocalSkills: React.Dispatch<React.SetStateAction<SkillItem[]>>
  ) => {
    setLocalSkills((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selectedLevel: level } : s))
    );
  };

  const [localSkills, setLocalSkills] = React.useState<SkillItem[]>(skills);
  React.useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[520px] max-h-[80vh] p-6 overflow-y-auto">
        <h2 className="text-[#5b4085] font-bold text-xl mb-4 text-center">
          Configure Skills
        </h2>

        <div className="space-y-4">
          {localSkills.map((skill, index) => (
            <div key={skill.no} className="border-b pb-3">
              <p className="font-semibold text-gray-700 mb-2">{skill.name}</p>

              <div className="space-y-2">
                {skill.rubrics.map((rubric) => (
                  <label
                    key={rubric.level}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`skill-${skill.no}`}
                      checked={skill.selectedLevel === rubric.level}
                      onChange={() =>
                        updateSkillLevel(index, rubric.level, setLocalSkills)
                      }
                    />

                    <div>
                      <p className="font-medium">Level {rubric.level}</p>
                      <p className="text-sm text-gray-600">
                        {lang === "en" ? rubric.descEN : rubric.descTH}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>

          <button
            onClick={() => onSave(localSkills)}
            className="px-4 py-2 rounded bg-[#5b4085] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigSkillModal;
