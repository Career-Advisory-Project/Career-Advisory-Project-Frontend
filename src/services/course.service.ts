import type { CourseOverviewResponse } from "../types/course";
/**
 * Fetch course overview + skill list
 */
export const getCourseOverview = async (): Promise<CourseOverviewResponse> => {
  const response = await fetch("/api/course/skill/{courseID}");

  if (!response.ok) {
    throw new Error("Failed to fetch course overview");
  }

  return response.json();
};
