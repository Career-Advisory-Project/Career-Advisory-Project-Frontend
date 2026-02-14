export interface Curriculum {
  program: string;
  curriculum_year: string;
  total_courses: number;
  total_skills: number;
}

export interface CurriculumListResponse {
  curriculums: Curriculum[];
}

export interface Skill {
  skillID: string;
  name: string;
  max_level: number;
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

export interface CurriculumCoursesResponse {
  curriculum_year: string;
  program: string;
  course_list: Course[];
}
