import type { Course } from "../../types/curriculum";

type CourseListTabProps = {
  courses: Course[];
};

const CourseListTab: React.FC<CourseListTabProps> = ({ courses }) => {
  return (
    <div className="bg-gray-100 p-6 space-y-3">
      {courses.map((course) => (
        <div
          key={course.courseNo}
          className="rounded-lg transition flex justify-between items-stretch overflow-hidden h-[80px] hover:bg-gray-50 bg-white"
        >
          <div className="flex-1 p-3 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-[#7a6aa6] font-extrabold uppercase">
                {course.courseNo}
              </span>
              {/* Separator Line */}
              <div className="h-[2px] bg-[#dcdbe6] flex-1 mx-3 rounded-full"></div>
              <span className="text-xs text-[#7a6aa6] font-bold whitespace-nowrap">
                {course.credit} Credits
              </span>
            </div>

            <h3 className="font-bold text-sm text-black truncate leading-tight">
              {course.name}
            </h3>
          </div>
        </div>
      ))}

      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      )}
    </div>
  );
};

export default CourseListTab;
