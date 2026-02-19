import type {
  AllCourseData ,
  CourseSkillResponse,
} from "../types/course";
import type { TeacherCourseResponse } from "../types/course";

export const getAllCourses = async (): Promise<AllCourseData> => {
  const response = await fetch("/api/all_course");

  if (!response.ok) {
    throw new Error("Failed to fetch all courses");
  }
  return response.json();
};

export const getTeacherCourses = async (
  teacherId: string
): Promise<TeacherCourseResponse> => {
  const response = await fetch(`/api/course/${teacherId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch teacher courses");
  }

  return response.json();
};

export const getCourseSkills = async (): Promise<CourseSkillResponse[]> => {
  const response = await fetch("/api/courseskills");

  if (!response.ok) {
    throw new Error("Failed to fetch course skills");
  }
  return response.json();
};

export const getCourseSkillsByCourseNo = async (
  courseNo: string
): Promise<CourseSkillResponse> => {
  const response = await fetch(`/api/courseskills/${courseNo}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course skills by course ID");
  }
  return response.json();
};
