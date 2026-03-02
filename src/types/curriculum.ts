export interface Curriculum {
  program: string;
  curriculum_year: string;
  total_courses: number;
  total_skills: number;
}

export interface CurriculumListResponse {
  curriculums: Curriculum[];
}

export interface CurriculumCoursesResponse {
  curriculum_year: string;
  program: string;
  course_list: Course[];
}

export interface Course {
  courseNo: string;
  name: string;
  credit: string;
}

export interface CurriculumSkillsResponse {
  curriculum_year: string;
  program: string;
  skill_list: Skill[];
}

export interface Skill {
  skillID: string;
  name: string;
  max_level: number;
}

//sync curriculum response
export interface CurriculumSyncResponse {
  ok: boolean;
  total_synced: number;
  total_failed: number;
  synced: string[];
  failed: { key: string; error: string }[];
}