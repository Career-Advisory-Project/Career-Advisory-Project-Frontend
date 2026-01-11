type Props = {
  open: boolean;
  lang: "en" | "th";
  onClose: () => void;
};

const ConfigSkillModal = ({ open, lang, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[520px] max-h-[80vh] p-6 overflow-y-auto">
        <h2 className="text-[#5b4085] font-bold text-xl mb-6 text-center">
          Skill Levels
        </h2>

        {/* Static Content */}
        <div className="space-y-6">
          {/* Skill 1 */}
          <div className="border-b pb-4">
            <p className="font-semibold text-gray-700 mb-3">Decision-Making</p>

            <div className="space-y-3 pl-2">
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#5b4085]">L1</span>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Has basic exposure or experience."
                    : "มีประสบการณ์หรือเคยสัมผัสมาก่อน"}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-bold text-[#5b4085]">L2</span>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Able to participate and contribute."
                    : "สามารถเข้าร่วมและมีส่วนร่วม"}
                </p>
              </div>
            </div>
          </div>

          {/* Skill 2 */}
          <div className="border-b pb-4">
            <p className="font-semibold text-gray-700 mb-3">Problem Solving</p>

            <div className="space-y-3 pl-2">
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#5b4085]">L1</span>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Understands basic problem-solving steps."
                    : "เข้าใจกระบวนการแก้ปัญหาเบื้องต้น"}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="font-bold text-[#5b4085]">L2</span>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Can analyze problems and propose solutions."
                    : "สามารถวิเคราะห์ปัญหาและเสนอแนวทางแก้ไข"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded bg-[#5b4085] text-white hover:bg-[#4a3370]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigSkillModal;
