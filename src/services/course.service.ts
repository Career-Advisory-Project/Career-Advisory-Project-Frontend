import type { CourseOverviewResponse } from "../types/course";
import type { TeacherCourseResponse } from "../types/course";
/**
 * Fetch course overview + skill list
 */
export const getCourseOverview = async (
  courseId: string
): Promise<CourseOverviewResponse> => {
  // =========================
  // 🔹 TEMP MOCK: No Skill List
  // =========================
  if (courseId === "__MOCK_NO_SKILL__") {
    console.log("🧪 Using mock course overview (no skills)");

    return Promise.resolve({
      ok: true,
      course: {
        courseNo: "__MOCK_NO_SKILL__",
        name: "Mock Course (No Skills)",
        descENG: "This course is used to test empty skill list behavior.",
        descTH: "รายวิชานี้ใช้สำหรับทดสอบกรณีไม่มีทักษะ",
        credit: 3,
      },
      skillList: [], // 👈 KEY PART
    });
  }

  // =========================
  // 🔹 REAL API CALL
  // =========================
  const response = await fetch(`/api/course/skill/${courseId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course overview");
  }

  return response.json();
};
// export const getCourseOverview = async (
//   courseId: string
// ): Promise<CourseOverviewResponse> => {
//   const response = await fetch(`/api/course/skill/${courseId}`);

//   if (!response.ok) {
//     throw new Error("Failed to fetch course overview");
//   }

//   return response.json();
// };

export const getTeacherCourses = async (
  teacherId: string
): Promise<TeacherCourseResponse> => {
  const response = await fetch(`/api/course/${teacherId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch teacher courses");
  }

  return response.json();
};
