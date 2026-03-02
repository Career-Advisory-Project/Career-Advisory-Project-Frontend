import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/layout/Navbar"; 
import { useNavigate, useLocation } from "react-router-dom";
import { getAllSkill } from "../../services/course.service";
import type { AllSkill } from "../../types/course";
import { useAppContext } from "../../context/AppContext";

const GRADE_LABELS = ["A", "B+", "B", "C+", "C", "D+", "D"];

const EditSkillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chartRef = useRef<HTMLDivElement>(null);
  const { lang } = useAppContext();
  
  const skillData = location.state || { 
    id: "", 
    name: "Unknown Skill", 
    scores: [1, 1, 1, 1, 1, 1, 1],
    courseNo: "",
    courseName: ""
  };

  const [currentScores, setCurrentScores] = useState<number[]>(
    skillData.scores.map((s: number | null) => s ?? 1)
  );
  
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [skillDetail, setSkillDetail] = useState<AllSkill | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkillDetail = async () => {
      if (!skillData.courseNo) return;
      
      setIsLoading(true);
      try {
        const allSkill: AllSkill[] = await getAllSkill();
        const currentSkillInfo = allSkill.find(s => String(s.id) === String(skillData.id));
        
        if (currentSkillInfo) {
          setSkillDetail(currentSkillInfo);
        }
      } catch (error) {
        console.error("Error fetching skill details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillDetail();
  }, [skillData.courseNo, skillData.id]);


  const handleMouseDown = (index: number) => {
    setDraggingIndex(index);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex === null || !chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    let newScore = (x / width) * 4 + 1;
    newScore = Math.max(1, Math.min(5, Math.round(newScore)));

    setCurrentScores((prev) => {
      const newScores = [...prev];
      newScores[draggingIndex] = newScore;
      return newScores;
    });
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  useEffect(() => {
    if (draggingIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingIndex]);

  const getLeftPosition = (score: number) => {
    return ((score - 1) / 4) * 100;
  };

  const handleSave = () => {
    // console.log("Saved Scores:", currentScores);
    navigate("/configskill", {
        state: {
            courseNo: skillData.courseNo,
            courseName: skillData.courseName,
            updatedSkill: {
                id: skillData.id,
                scores: currentScores
            }
        }
    });
  };

  const handleRemove = () => {
    const isConfirmed = window.confirm("Are you sure you want to remove this skill?");
    if (!isConfirmed) return;

    // console.log("Removed Skill:", skillData.name);
    navigate("/configskill", {
        state: {
            courseNo: skillData.courseNo,
            courseName: skillData.courseName,
            updatedSkill: {
                id: skillData.id,
                scores: Array(7).fill(null)
            }
        }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-['CMU'] overflow-x-hidden select-none">
      <Navbar />

      <div className="flex-1 flex justify-center py-8 px-4">
        <div className="w-full max-w-[1240px] bg-white rounded-lg shadow-lg relative flex flex-col pb-24">
          
          {/* Header */}
          <div className="px-10 pt-10 pb-4">
            <h1 className="text-[#5E4481] text-2xl font-bold mb-4">
              {skillData.courseName} - Skill
            </h1>
            <hr className="border-black border-1" />
          </div>

          {/* Skill Title */}
          <div className="px-10 mt-4 flex justify-between items-center">
            <div>
               <h2 className="text-[#5E4481] text-3xl font-bold">
                 {skillData.name}
               </h2>
            </div>
            
            <button 
            onClick={handleRemove}
            className="bg-[#C95F5F] hover:bg-[#b14e4e] text-white font-bold py-2 px-6 rounded shadow transition-colors">
              Remove Skill
            </button>
          </div>

          {/* --- Interactive Chart Section --- */}
          <div className="px-10 mt-12 mb-10 relative select-none">
            <div ref={chartRef} className="h-[350px] relative border-l border-r border-transparent mx-8" >
              
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {GRADE_LABELS.map((_, i) => (
                   <div key={i} className="border-b border-gray-100 w-full absolute" style={{ top: `${(i * 12) + 9}%` }}></div>
                ))}
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                        key={`v-line-${num}`}
                        className="absolute top-0 bottom-7 border-l border-gray-100" 
                        style={{ left: `${((num - 1) / 4) * 100}%` }}
                    ></div>
                ))}
              </div>
              <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
                 <div className="absolute bottom-0 left-0 right-0 border-b-2 border-gray-400"></div>
                    
                 {[1, 2, 3, 4, 5].map((num) => (
                   <div 
                    key={num} 
                    className="absolute bottom-0 flex flex-col items-center pb-1" 
                    style={{ 
                        left: `${((num - 1) / 4) * 100}%`, 
                        transform: 'translateX(-50%)' 
                    }}
                   >
                      <div className="h-4 border-l-2 border-gray-400"></div>
                      <span className="mt-2 text-xl font-bold text-gray-700">{num}</span>
                   </div>
                 ))}
              </div>

              {/* Data Points (Draggable) */}
              {GRADE_LABELS.map((grade, index) => {
                 const score = currentScores[index];
                 const topPos = `${(index * 12) + 5}%`;
                 const leftPos = `${getLeftPosition(score)}%`;

                 return (
                  <div
                    key={grade}
                    className="absolute flex items-center group cursor-pointer"
                    style={{
                      left: leftPos,
                      top: topPos,
                      transform: 'translateX(0%)', 
                      transition: draggingIndex === index ? 'none' : 'left 0.2s ease-out' 
                    }}
                    onMouseDown={() => handleMouseDown(index)}
                  >
                    <div className={`text-white text-sm font-bold px-3 py-1.5 rounded-l-md h-[30px] flex items-center justify-center min-w-[40px] shadow-sm ${draggingIndex === index ? 'bg-[#7D5BA6] ' : 'bg-[#5E4481]'} transition-transform`}>
                      {grade}
                    </div>
                    <div className={`w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[15px] ${draggingIndex === index ? 'border-l-[#7D5BA6] ' : 'border-l-[#5E4481]'}`}></div>
                    {draggingIndex === index && (
                        <div className="absolute top-0 left-0 -right-30 text-center text-[#5E4481] font-bold">
                            Level {score}
                        </div>
                    )}
                  </div>
                 );
              })}
            </div>
          </div>

          <div className="px-4 sm:px-10 flex flex-wrap gap-4 mt-16">
            {[1, 2, 3, 4, 5].map((levelNum) => {
              const detailArray = skillDetail?.rubrics || [];
              const levelData = detailArray.find((l: any) => Number(l.level) === levelNum);
              const levelDescription = levelData 
                ? (lang === "en" ? levelData.descENG : levelData.descTH)
                : null;
              {/* Detail Box */}
              return (
                <div key={levelNum} className="flex-1 min-w-[180px] min-h-[180px] bg-gray-200 rounded p-5 flex flex-col border border-gray-300 shadow-sm">
                  <h3 className="text-[#5E4481] font-bold text-lg mb-2">Level {levelNum}</h3>
                  <hr className="border-gray-300 mb-3" />
                  
                  {isLoading ? (
                    <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
                  ) : levelDescription ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {levelDescription}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No description available for this level.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Buttons */}
          <div className="absolute bottom-8 right-4 sm:right-10 flex gap-4 pt-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-[180px] h-[50px] bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow transition-colors"
            >
              Cancel
            </button>
            <button 
            onClick={handleSave}
            className="w-[180px] h-[50px] bg-[#5E4481] hover:bg-[#4a3370] text-white font-bold rounded-lg shadow transition-colors">
              Confirm
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditSkillPage;