import type {
  AllCourseData ,
  CourseSkillResponse,
  DashboardResponse,
  CourseDetailResponse,
} from "../types/course";
import type { TeacherCourseResponse } from "../types/course";

export const getDashboardCourses = async (
  cmuitaccount: string
): Promise<DashboardResponse> => {
  const response = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/dashboard/${cmuitaccount}`);

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard courses");
  }

  return response.json();
};

export const getCourseDetail = async (
  courseNo: string
): Promise<CourseDetailResponse> => {
  const response = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/all_course/${courseNo}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course detail");
  }

  return response.json();
};

//for add / remove dashboard courses
export const addDashboardCourses = async ( 
  cmuitaccount: string,
  coursesNoList: string[]
): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/dashboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmuitaccount, coursesNoList }),
  });

  if (!response.ok) {
    throw new Error("Failed to add dashboard courses");
  }
};

export const removeDashboardCourses = async (
  cmuitaccount: string,
  coursesNoList: string[]
): Promise<void> => {
  const response = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/dashboard`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmuitaccount, coursesNoList }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove dashboard courses");
  }
};

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
