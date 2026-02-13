import type { Curriculum, CurriculumListResponse } from "../types/curriculum";

export const getCurriculums = async (): Promise<Curriculum[]> => {
  const response = await fetch(`${import.meta.env.VITE_MOCK_API_URL}/admin/curriculum`);

  if (!response.ok) {
    throw new Error("Failed to fetch curriculums");
  }

  const data: CurriculumListResponse = await response.json();
  return data.curriculums;
};
