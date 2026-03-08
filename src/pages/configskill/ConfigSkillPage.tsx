import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSkill,
  getCourseSkillsByCourseNo,
  deleteCourseSkill,
  putCourseSkill } from "../../services/course.service";
import type { CourseSkillResponse, SkillItem, SkillRubric } from "../../types/course";
import { useAppContext } from "../../context/AppContext";


interface LocationState {
  courseNo?: string;
  courseName?: string;
  updatedSkill?: {
    id: string; 
    scores: (number | null)[]; 
  };
}
interface LocalSkill {
  id: string;
  name: string;
  expanded: boolean;
  scores?: (number | null)[];
}
const grades = ["A", "B+", "B", "C+", "C", "D+", "D"];

const ConfigSkillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as LocationState | null;
  const [skills, setSkills] = useState<LocalSkill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [skillsToRemove, setSkillsToRemove] = useState<string[]>([]);
  const [existingSkillIds, setExistingSkillIds] = useState<string[]>([]);
  const { lang } = useAppContext();

useEffect(() => {
    const courseNo = stateData?.courseNo;
    if (!courseNo) return;

    const DRAFT_REMOVE_KEY = `draft_remove_${courseNo}`;
    const DRAFT_SCORES_KEY = `draft_scores_${courseNo}`;

    let currentRemoved: string[] = JSON.parse(sessionStorage.getItem(DRAFT_REMOVE_KEY) || "[]");
    let currentScoresDraft: Record<string, (number | null)[]> = JSON.parse(sessionStorage.getItem(DRAFT_SCORES_KEY) || "{}");

    if (stateData?.updatedSkill) {
      const { id, scores } = stateData.updatedSkill;
      const isRemoved = scores.every((s) => s === null);

      if (isRemoved) {
       
        if (!currentRemoved.includes(id)) currentRemoved.push(id);
        delete currentScoresDraft[id]; 
      } else {
        currentRemoved = currentRemoved.filter((remId) => remId !== id);
        currentScoresDraft[id] = scores; 
      }

      sessionStorage.setItem(DRAFT_REMOVE_KEY, JSON.stringify(currentRemoved));
      sessionStorage.setItem(DRAFT_SCORES_KEY, JSON.stringify(currentScoresDraft));
    }

    setSkillsToRemove(currentRemoved); 

    const fetchSkillsData = async () => {
          setIsLoading(true);
          try {
            const [allSkill, courseSkillsResult] = await Promise.all([
              getAllSkill(),
              getCourseSkillsByCourseNo(courseNo)
            ]);

            const configuredSkills: SkillItem[] = (courseSkillsResult as CourseSkillResponse).skills || [];

            const dbSkillIds: string[] = [];

            const formattedSkills: LocalSkill[] = allSkill.map((apiSkill) => {
              const strApiId = String(apiSkill.id);
              const defaultScores = Array(7).fill(null);
              let isConfigured = false;

              const matchedCourseSkill = configuredSkills.find(
                (cs: SkillItem) => String(cs.id) === strApiId
              );

              if (matchedCourseSkill) {
                dbSkillIds.push(strApiId);
              }

              const isMarkedForRemove = currentRemoved.includes(strApiId);
              const draftScores = currentScoresDraft[strApiId];

              if (isMarkedForRemove) {
                 isConfigured = false;
              } else if (draftScores) {
                 isConfigured = true;
                 for(let i = 0; i < 7; i++) defaultScores[i] = draftScores[i];
              } else if (matchedCourseSkill) {
                 isConfigured = true;
                 const rubricsData: SkillRubric[] = matchedCourseSkill.rubrics || apiSkill.rubrics || [];

                 if (rubricsData && Array.isArray(rubricsData)) {
                    grades.forEach((gradeName, index) => {
                       const matchedRubric = rubricsData.find((r: SkillRubric) => r.grade === gradeName);
                       if (matchedRubric && matchedRubric.level) {
                         defaultScores[index] = matchedRubric.level;
                       }
                    });
                 }
              }

              return {
                id: strApiId,
                name: apiSkill.name,
                expanded: isConfigured,
                scores: defaultScores, 
              };
            });

            setExistingSkillIds(dbSkillIds);
            setSkills(formattedSkills);

          } catch (error) {
            console.error("Error fetching skills:", error);
          } finally {
            setIsLoading(false);
          }
        };

    fetchSkillsData();
  }, [stateData?.courseNo, stateData?.updatedSkill]);

  // Handle No Course
  if (!stateData?.courseNo) {
     return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <h1 className="text-xl text-gray-600">No Course Selected</h1>
            <button onClick={() => navigate(-1)} className="text-blue-500 underline">Go Back</button>
        </div>
     );
  }

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (a.expanded && !b.expanded) return -1;
    if (!a.expanded && b.expanded) return 1;
    
    return a.name.localeCompare(b.name);
  });

  const handleSkillClick = (skill: LocalSkill) => {
    navigate("/editskill", { 
      state: { 
        id: skill.id,
        name: skill.name,
        scores: skill.scores,
        courseNo: stateData.courseNo,
        courseName: stateData.courseName
      } 
    });
  };

  const handleConfirm = async () => {
    if (!stateData?.courseNo) return;

    try {
      setIsLoading(true);

      // --- DELETE (only skills that exist in DB) ---
      const actualSkillsToRemove = skillsToRemove.filter(id => existingSkillIds.includes(id));
      if (actualSkillsToRemove.length > 0) {
        for (const skillId of actualSkillsToRemove) {
          await deleteCourseSkill(stateData.courseNo!, skillId);
        }
        // console.log("Deleted all selected skills successfully.");
      }

      // --- POST & PATCH ---
      const skillsToSave = skills.filter(skill => skill.expanded);
      
      for (const skill of skillsToSave) {
        const rubricsPayload: { grade: string; level: number }[] = [];
        
        grades.forEach((gradeName, index) => {
          const levelScore = skill.scores?.[index];
          if (levelScore !== null && levelScore !== undefined) {
            rubricsPayload.push({
              grade: gradeName,
              level: levelScore
            });
          }
        });

        const payload = {
          courseNo: stateData.courseNo!,
          skillID: skill.id, 
          rubrics: rubricsPayload
        };
        
          await putCourseSkill(payload);
        
      }
      sessionStorage.removeItem(`draft_remove_${stateData.courseNo}`);
      sessionStorage.removeItem(`draft_scores_${stateData.courseNo}`);

      navigate("/dashboard"); 

    } catch (error) {
      console.error("Error saving config:", error);
      alert("ERROR TO SAVE");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (stateData?.courseNo) {
      sessionStorage.removeItem(`draft_remove_${stateData.courseNo}`);
      sessionStorage.removeItem(`draft_scores_${stateData.courseNo}`);
    }
    navigate("/dashboard"); 
  };
  

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-['CMU']">
      <Navbar />
      
      <div className="flex-1 flex justify-center px-6 py-8 min-h-0">
        <div className="w-full max-w-[1240px] bg-white rounded-[8px] shadow-lg flex flex-col min-h-0">
          {/* Header */}
          <div className="px-10 pt-10 pb-4 shrink-0">
            <h1 className="text-[#5E4481] text-2xl font-bold mb-4">
              {stateData.courseName} - Skill
            </h1>
            <p className="font-light mb-2">
            {lang === "en" 
              ? "Browse and add skills relevant to this course, then define the criteria for each." 
              : "เลือกและเพิ่มทักษะที่เกี่ยวข้องกับหลักสูตรนี้ จากนั้นกำหนดเกณฑ์สำหรับแต่ละทักษะ"}
            </p>
            <hr className="border-black-300 border-1" />
          </div>

          {/* Search Bar */}
          <div className="px-10 mb-4 shrink-0">
            <input 
              type="text"
              placeholder="Search Skill ..."
              className="w-full bg-[#EEEEEE] p-3 rounded text-gray-700 text-sm pl-4 outline-none focus:ring-2 focus:ring-[#5E4481]"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          {/* Scrollable Skill List */}
          <div className="flex-1 px-10 min-h-0">
            <div className="h-full bg-gray-200 overflow-y-auto px-4 sm:px-10 py-8 rounded-[5px] space-y-4">
            {sortedSkills.length > 0 ? (
              sortedSkills.map((skill) => (
                <div 
                  key={skill.id} 
                  onClick={() => handleSkillClick(skill)}
                  className={`relative bg-white border-2 border-gray-200 rounded-lg shadow-sm transition-all cursor-pointer hover:border-[#5E4481] hover:shadow-md ${skill.expanded ? 'p-6' : 'p-4 h-[60px] flex items-center'}`}
                >
                  <div 
                    className={`absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-l-transparent rounded-tr-sm
                      ${skill.expanded ? 'border-t-[#5E4481]' : 'border-t-gray-400'}`}
                  ></div>

                  <h3 className={`text-[#5E4481] font-bold text-lg ${skill.expanded ? 'mb-6' : ''}`}>
                      {skill.name}
                  </h3>

                  {skill.expanded && (
                    <div className="flex justify-between px-8">
                      {grades.map((grade, index) => (
                        <div key={grade} className="flex flex-col items-center gap-2">
                          <span className="text-gray-600 font-bold text-sm">{grade}</span>
                          <div className="w-12 h-14 border-2 border-gray-400 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600">
                            {skill.scores && skill.scores[index] !== null ? skill.scores[index] : "?"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 mt-10">Skill not found</div>
            )}
            </div>
          </div>

          {/* Buttons — pinned at bottom */}
          <div className="flex justify-end gap-4 px-10 py-6 shrink-0">
                <button 
                  onClick={handleCancel}
                  className="w-[180px] h-[50px] bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow transition-colors"
                >
                  Cancel
                </button>
                <button 
                onClick={handleConfirm}
                disabled={isLoading} 
                className={`w-[180px] h-[50px] text-white font-bold rounded-lg shadow transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5E4481] hover:bg-[#4a3370]'}`}>
                {isLoading ? 'Saving...' : 'Confirm'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSkillPage;