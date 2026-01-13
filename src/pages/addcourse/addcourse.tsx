//This page is ai gen
import { useState } from "react";

type Course = {
  courseNo: string;
  name: string;
  credits?: number;
};

const MOCK_COURSES: Course[] = Array.from({ length: 12 }).map((_, i) => ({
  courseNo: `2610${i}`,
  name: "Course Name",
  credits: 3,
}));

const AddCoursePage = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-6 py-8">
        <div className="flex gap-6 max-w-[1200px] w-full h-full">
          {/* LEFT: ALL COURSE */}
          <div className="w-[420px] bg-white rounded-xl shadow p-4 flex flex-col">
            <h2 className="text-center font-bold text-lg mb-3">All Course</h2>

            <input
              type="text"
              placeholder="Search Course ..."
              className="mb-4 px-3 py-2 border rounded text-sm"
            />

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {MOCK_COURSES.map((course) => (
                <div
                  key={course.courseNo}
                  onClick={() => setSelectedCourse(course)}
                  className={`border rounded-lg p-3 cursor-pointer transition
                    ${
                      selectedCourse?.courseNo === course.courseNo
                        ? "border-[#5b4085] bg-[#f4f1fa]"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">{course.courseNo}</p>
                      <p className="font-semibold text-sm">{course.name}</p>
                    </div>
                    <span className="text-xs text-purple-600">
                      {course.credits} Credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: COURSE DETAIL */}
          <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col">
            {selectedCourse ? (
              <>
                <h2 className="text-center text-[#5b4085] font-bold text-xl mb-6">
                  {selectedCourse.name}
                </h2>

                <h3 className="text-center font-semibold mb-3">Skill List</h3>

                <div className="border rounded-lg p-3 flex justify-between text-sm">
                  <span className="text-purple-600 font-semibold">
                    Programming
                  </span>
                  <span className="text-gray-600">Level 3</span>
                </div>

                {/* push button to bottom */}
                <div className="mt-auto flex justify-center">
                  <button className="bg-[#5b4085] text-white font-semibold px-10 py-2 rounded-lg hover:bg-[#4a3370] transition">
                    Finish
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a course to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoursePage;
