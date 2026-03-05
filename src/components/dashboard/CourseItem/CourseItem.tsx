import type { DashboardCourse } from "../../../types/course";

type Props = {
  course: DashboardCourse;
  onClick: () => void;
};

const CourseItem = ({ course, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg transition flex justify-between items-stretch overflow-hidden h-[80px] hover:bg-gray-50 bg-white cursor-pointer"
    >
      <div className="flex-1 p-3 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-[#7a6aa6] font-extrabold uppercase">
            {course.courseNo}
          </span>
          {/* Separator Line */}
          <div className="h-[2px] bg-[#dcdbe6] flex-1 mx-3 rounded-full"></div>
        </div>

        <h3 className="font-bold text-sm text-black truncate leading-tight">
          {course.name}
        </h3>
      </div>
    </div>
  );
};

export default CourseItem;
