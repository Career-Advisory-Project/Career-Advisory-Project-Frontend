import type { TeacherCourse } from "../../../types/course";

type Props = {
  course: TeacherCourse;
  lang: "en" | "th";
  onClick: () => void;
};

const CourseItem = ({ course, lang, onClick }: Props) => {
  const name = lang === "en" ? course.courseNameEN : course.courseNameTH;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm px-4 py-3 flex justify-between items-center cursor-pointer
                 hover:bg-[#f0ecfa] transition"
    >
      <div>
        <p className="text-sm text-gray-500">{course.courseNo}</p>
        <p className="font-semibold text-gray-800">{name}</p>
      </div>

      <div className="text-sm font-medium text-[#5b4085]">
        {course.credit} Credits
      </div>
    </div>
  );
};

export default CourseItem;
