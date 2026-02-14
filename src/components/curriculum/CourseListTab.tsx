import type { Course } from "../../types/curriculum";

type CourseListTabProps = {
  courses: Course[];
};

const CourseListTab: React.FC<CourseListTabProps> = ({ courses }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 space-y-3">
      {courses.map((course) => (
        <div
          key={course.courseNo}
          className="bg-white px-6 py-4 rounded-md flex justify-between items-center shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-[#5b4085] text-xs font-bold uppercase mb-1">
              {course.courseNo}
            </span>
            <span className="text-black font-bold text-lg">{course.name}</span>
          </div>
          <span className="text-gray-500 font-bold text-sm">
            {course.credit} Credits
          </span>
        </div>
      ))}

      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      )}
    </div>
  );
};

export default CourseListTab;
