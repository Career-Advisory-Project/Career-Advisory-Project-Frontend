import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate, useLocation } from "react-router-dom";

//Mock รอ API
interface LocationState {
  courseNo?: string;
  courseName?: string;
  updatedSkill?: {
    id: number;
    scores: (number | null)[]; 
  };
}
//Mock รอ API
interface Skill {
  id: number;
  name: string;
  expanded: boolean;
  scores?: (number | null)[];
}

const mockSkills = [
  { 
    id: 1, 
    name: "Programming", 
    expanded: true, 
    scores: [5, 4, 3, 3, 3, 3, 3]
  },
  { 
    id: 2, 
    name: "Skill Name", 
    expanded: true, 
    scores: [null, null, null, null, null, null, null] 
  },
  { id: 3, name: "Skill Name", expanded: false },
  { id: 4, name: "Skill Name", expanded: false },
  { id: 5, name: "Skill Name", expanded: false },
  { id: 6, name: "Skill Name", expanded: false },
  { id: 7, name: "Skill Name", expanded: false },
];

const grades = ["A", "B+", "B", "C+", "C", "D+", "D"];

const ConfigSkillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [searchTerm, setSearchTerm] = useState("");
  const stateData = location.state as LocationState | null;

  useEffect(() => {
    if (stateData?.updatedSkill) {
       console.log("Updated data received:", stateData.updatedSkill);
       
       setSkills((prevSkills) => 
         prevSkills.map((skill) => {
           if (Number(skill.id) === Number(stateData.updatedSkill!.id)) {
             return { ...skill, scores: stateData.updatedSkill!.scores };
           }
           return skill;
         })
       );
       
    }
  }, [location.state]);

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

  const handleSkillClick = (skill: any) => {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="w-[1240px] h-[855px] bg-white rounded-[8px] shadow-lg relative ">
          {/* Header */}
          <div className="px-10 pt-10 pb-4">
            <h1 className="text-[#5E4481] text-2xl font-bold mb-4">
              {stateData.courseName} - Skill
            </h1>
            <hr className="border-gray-300 border-2" />
          </div>

          {/* Search Bar */}
          <div className="px-10 mb-4">
            <input 
              type="text"
              placeholder="Search Skill ..."
              className="w-full bg-[#EEEEEE] p-3 rounded text-gray-700 text-sm pl-4 outline-none focus:ring-2 focus:ring-[#5E4481]"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          {/* List */}
          <div className="flex-1 px-10 pb-24 space-y-4 custom-scrollbar">
            <div className="flex-1 bg-gray-200 space-y-4 overflow-auto px-10 py-8 rounded-[5px] pb-24 h-[550px]">
            {filteredSkills.length > 0 ? (
              filteredSkills.map((skill) => (
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

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 mt-4">
                  <button 
                    onClick={() => navigate(-1)}
                    className="w-[180px] h-[50px] bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="w-[180px] h-[50px] bg-[#5E4481] hover:bg-[#4a3370] text-white font-bold rounded-lg shadow transition-colors">
                    Confirm
                  </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSkillPage;