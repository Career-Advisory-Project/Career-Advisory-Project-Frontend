import { useEffect, useState } from "react";
import type { CourseDetail } from "../../../types/course";
import { getCourseSkillsByCourseNo } from "../../../services/course.service";
import "../../../assets/styles/dashboard.css";
import SkillList from "./SkillList";
import { useAppContext } from "../../../context/AppContext";
<<<<<<< HEAD
import ConfigSkillPage from "../../../pages/configskill/configskill";
import { useNavigate } from "react-router-dom";

=======
import { useNavigate } from "react-router-dom";
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6

type Props = {
  course: CourseDetail | null;
};

const CourseOverview = ({ course }: Props) => {
  const { lang } = useAppContext();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const [courseDesc, setCourseDesc] = useState<{
    descTH?: string;
    descENG?: string;
  } | null>(null);

  useEffect(() => {
    if (!course) {
      setCourseDesc(null);
      return;
    }

    const fetchDesc = async () => {
      try {
        const data = await getCourseSkillsByCourseNo(course.courseNo);
        setCourseDesc({
          descTH: data.descTH,
          descENG: data.descENG,
        });
      } catch {
        // Fallback to CourseDetail description
        setCourseDesc({
          descTH: course.detailTH,
          descENG: course.detailEN,
        });
      }
    };

    fetchDesc();
  }, [course]);
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6

  if (!course) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a course to view details
      </div>
    );
  }
<<<<<<< HEAD
  const courseNo =  course.courseNo;
  const title = course.name;
  const detail = lang === "en" ? course.descENG : course.descTH;
=======


  const courseNo =  course.courseNo;
  
  const title = course.courseNameEN;
  const detail =
    lang === "en"
      ? courseDesc?.descENG ?? course.detailEN
      : courseDesc?.descTH ?? course.detailTH;
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6

  return (
    <div className="w-full">
      <div className="dashboard-card w-full h-auto lg:h-[calc(100vh-160px)] overflow-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm">
            Course Overview
          </h2>

          <h1 className="text-[#5b4085] font-bold mt-1 !text-[30px]">
            {title}
          </h1>

          <hr className="border-gray-300 w-full max-w-[718px] my-4 mx-auto" />
        </div>

        {/* Course Detail */}
        <div className="dashboard-panel w-full max-w-[719px] min-h-[150px] mx-auto">
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {detail ??
              (lang === "en"
                ? "This course has no description available."
                : "ไม่มีคำอธิบายสำหรับหลักสูตรนี้")}
          </p>
        </div>

        {/* Skill List */}
        <div className="dashboard-panel w-full max-w-[719px] min-h-[200px] mt-3 mx-auto">
          <h3 className="text-center text-[#5b4085] text-xl font-bold mb-4">
            Skill List
          </h3>

          <SkillList courseNo={course.courseNo} />
        </div>

<<<<<<< HEAD
=======
        {/* Config Button (still disabled) */}
>>>>>>> 017ac14ca232dfee65aa52a2163ee24c0ac242b6
        <div className="flex justify-end mt-3 px-8">
        <button
              onClick={() => {
                navigate("/configskill", { 
                  state: { 
                    courseNo: courseNo,
                    courseName: title 
                  } 
                });
              }}
              className="font-bold py-2 px-8 rounded shadow-md w-[232px] h-[50px] bg-[#5E4481] text-white hover:bg-[#4a3370]"
            >
          Config Skill
        </button>
      </div>
      </div>
    </div>
  );
};

export default CourseOverview;
