export interface Curriculum {
  program: string;
  curriculum_year: string;
  total_courses: number;
  total_skills: number;
}

export interface CurriculumListResponse {
  curriculums: Curriculum[];
}
