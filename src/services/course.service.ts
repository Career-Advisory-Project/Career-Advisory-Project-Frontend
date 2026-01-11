import type {
  CourseOverviewResponse,
  CourseSkillResponse,
} from "../types/course";
import type { TeacherCourseResponse } from "../types/course";

export const getCourseOverview = async (
  courseId: string
): Promise<CourseOverviewResponse> => {
  const response = await fetch(`/api/courseskills/${courseId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course overview");
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
