import React, { useState, useEffect } from 'react';

interface SkillItem {
  no: string;
  skillTitle: string;       
  skillDescriptionEN: string;
  skillDescriptionTH: string;
  skillType: string;
  skillLevel: number;       
}

interface CourseInfo {
  courseNo: string;
  courseNameEN: string;
  courseNameTH: string;
  courseDetail: string;     
  credit: number;
}

interface ApiResponse {
  ok: boolean;
  course: CourseInfo;
  skillList: SkillItem[];  
}

const CourseOverview: React.FC = () => {
  
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/course/skill');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log("Data from API:", result);

        setData(result); 

      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  if (!data || !data.course) return <div className="p-10 text-center">No course data found</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-end p-4 font-['CMU']">
      <div className="bg-white rounded-[8px] shadow-xl w-[819px] h-[793px] p-4">
        
        <div className="text-center mb-6">
          <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Course Overview</h2>

          {/* CourseName */ }
          <h1 className="text-[#5b4085] font-bold mt-1 !text-[30px]">
            {data.course.courseNameEN} 
          </h1>

          <hr className='border-gray-300 w-[718px] my-4 mx-auto'/>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 w-[719px] h-[234px] mx-auto overflow-y-auto">
          
          {/* courseDetail */}
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {data.course.courseDetail}
          </p>
        </div>

        {/* skillList */}
        <div className="bg-gray-100 rounded-lg w-[719px] h-[341px] p-6 mt-3 mx-auto overflow-y-auto">
          <h3 className="text-center text-[#5b4085] text-xl font-bold mb-4">Skill List</h3>
          <div className="space-y-3 ">
            {data.skillList.map((skill, index) => (

              <div key={index} className="bg-white rounded shadow-sm w-[669px] h-[53px] p-4  ">
                <div className="flex justify-between items-center border-b-1 border-gray-300 pb-1">
                {/* skillTitle */}
                <span className="text-[#6a5acd] font-bold text-lg ">
                  {skill.skillTitle}
                </span>
                
                {/* skillLevel */}
                <span className="text-gray-800 font-bold text-sm">
                  Level {skill.skillLevel}
                </span>
                </div>
              </div>
                
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-3 px-4">
          <button className="bg-[#5b4085] hover:bg-[#4a3370] text-white font-bold py-2 px-8 rounded shadow-md transition-colors duration-200 w-[232px] h-[50px] mx-4">
            Config Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;