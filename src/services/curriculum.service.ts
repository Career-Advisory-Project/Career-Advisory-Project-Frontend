import type {
  Curriculum,
  CurriculumListResponse,
  CurriculumSkillsResponse,
  CurriculumCoursesResponse,
} from "../types/curriculum";

export const getCurriculums = async (): Promise<Curriculum[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_MOCK_API_URL}/admin/curriculum`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch curriculums");
  }

  const data: CurriculumListResponse = await response.json();
  return data.curriculums;
};

export const getCurriculumSkills = async (
  program: string,
  curriculum_year: string
): Promise<CurriculumSkillsResponse> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_MOCK_API_URL
    }/admin/curriculum/${program}/${curriculum_year}/skills`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch curriculum skills");
  }

  return response.json();
};

export const getCurriculumCourses = async (
  program: string,
  curriculum_year: string
): Promise<CurriculumCoursesResponse> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_MOCK_API_URL
    }/admin/curriculum/${program}/${curriculum_year}/courses`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch curriculum courses");
  }

  return response.json();
};
