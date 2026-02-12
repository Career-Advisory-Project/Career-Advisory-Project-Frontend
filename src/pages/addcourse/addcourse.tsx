//This page is ai gen
import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import CourseCard from "../../components/addcourse/CourseCard";
import SkillItem from "../../components/addcourse/SkillItem";
import SearchInput from "../../components/common/SearchInput";

type Course = {
  courseNo: string;
  name: string;
  credits?: number;
  skills?: { name: string; level: number }[]; // Added skills to mock data structure
};

const MOCK_COURSES: Course[] = Array.from({ length: 4 }).map((_, i) => ({
  courseNo: `261XXX`,
  name: i === 0 ? "Computer Programming" : "Course Name",
  credits: 3,
  skills: [
    { name: "Programming", level: 3 },
  ],
}));

const AddCoursePage = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(MOCK_COURSES[0]); // Default select first one to match design
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />
      
      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="flex gap-8 max-w-[1200px] w-full h-[80vh]">
          
          {/* LEFT: ALL COURSE LIST */}
          <div className="w-[45%] bg-white rounded-xl ps-8 pe-4 py-6 flex flex-col shadow-sm">
            <h2 className="text-center font-bold text-xl text-black mb-6">All Course</h2>

            <SearchInput 
              placeholder="Search Course ..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {MOCK_COURSES.map((course, index) => (
                <CourseCard
                  key={index}
                  courseNo={course.courseNo}
                  name={course.name}
                  credits={course.credits}
                  isSelected={selectedCourse?.courseNo === course.courseNo && selectedCourse?.name === course.name}
                  onClick={() => setSelectedCourse(course)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: COURSE DETAIL & SKILLS */}
          <div className="w-[55%] flex flex-col">
              
            {/* White Container for Details */}
            <div className="flex-1 bg-white rounded-xl shadow-sm p-8 flex flex-col mb-4">
              {selectedCourse ? (
                <>
                  <h2 className="text-center text-[#5b4085] font-bold text-xl mb-8">
                    {selectedCourse.name}
                  </h2>

                  <div className="bg-[#fcfbfc] rounded-lg p-6 flex-1">
                    <h3 className="text-center font-bold text-[#5b4085] mb-4">Skill List</h3>
                    
                    <div className="space-y-3">
                      {selectedCourse.skills?.map((skill, idx) => (
                        <SkillItem key={idx} name={skill.name} level={skill.level} />
                      ))}
                      {/* Add more mock skills if needed to verify list look */}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a course to view details
                </div>
              )}
            </div>

            {/* Finish Button Area */}
            <div className="flex justify-end">
                <button className="bg-[#5b4085] text-white font-bold px-12 py-3 rounded-lg hover:bg-[#4a3370] transition shadow-md">
                  Finish
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
