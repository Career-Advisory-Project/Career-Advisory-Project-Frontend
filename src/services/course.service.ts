import type {
  CourseOverviewResponse,
  CourseSkillResponse,
  AllSkill,
  TeacherCourseResponse,
  PostCourseSkillPayload} from "../types/course";

export const getCourseOverview = async (
  courseId: string
): Promise<CourseOverviewResponse> => {
  const response = await fetch(`/api/courseskills/${courseId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch course overview");
  }

  return response.json();
};

export const getAllSkill = async (
  id: string
): Promise<AllSkill[]> => {
  const response = await fetch(`/api/courseskills/allskill`);

  if (!response.ok) {
    throw new Error("Failed to fetch skills");
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

export const deleteCourseSkill = async (courseNo: string, skillID: string) => {
  const response = await fetch(`api/courseskills/delete`, {
    method: 'DELETE', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      courseNo: courseNo,
      skillID: skillID
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete course skill");
  }

  return response.json();
};

export const postCourseSkill = async (payload: PostCourseSkillPayload) => {
  const response = await fetch(`http://localhost:3000/courseskills/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to post course skill");
  }

  return response.json();
};

export const patchCourseSkill = async (payload: PostCourseSkillPayload) => {
  const response = await fetch(`api/courseskills/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update course skill (PATCH)");
  }

  return response.json();
};
