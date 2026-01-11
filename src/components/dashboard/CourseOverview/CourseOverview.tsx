import type { TeacherCourse } from "../../../types/course";
import "../../../assets/styles/dashboard.css";
import SkillList from "./SkillList";

type Props = {
  lang: "en" | "th";
  course: TeacherCourse;
};

const CourseOverview = ({ lang, course }: Props) => {
  const title = course.name;
  const detail = lang === "en" ? course.descENG : course.descTH;

  return (
    <div className="flex items-center justify-end font-['CMU']">
      <div className="dashboard-card w-[819px] h-[793px]">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm">
            Course Overview
          </h2>

          <h1 className="text-[#5b4085] font-bold mt-1 !text-[30px]">
            {title}
          </h1>

          <hr className="border-gray-300 w-[718px] my-4 mx-auto" />
        </div>

        {/* Course Detail */}
        <div className="dashboard-panel w-[719px] h-[234px] mx-auto">
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {detail ??
              (lang === "en"
                ? "This course has no description available."
                : "ไม่มีคำอธิบายสำหรับหลักสูตรนี้")}
          </p>
        </div>

        {/* Skill List */}
        <div className="dashboard-panel w-[719px] min-h-[341px] mt-3 mx-auto">
          <h3 className="text-center text-[#5b4085] text-xl font-bold mb-4">
            Skill List
          </h3>

          <SkillList courseNo={course.courseNo} lang={lang} />
        </div>

        {/* Config Button (still disabled) */}
        <div className="flex justify-end mt-3 px-4">
          <button
            disabled
            className="font-bold py-2 px-8 rounded shadow-md w-[232px] h-[50px]
              bg-gray-300 cursor-not-allowed text-gray-500"
          >
            Config Skill
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
