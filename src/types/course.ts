export interface SkillItem {
  no: string;
  name: string;
  descTH: string;
  descENG: string;
  tags: string[];
  rubrics: SkillRubric[];

  // 🔹 frontend-only selected level
  selectedLevel?: number;
}

export interface SkillRubric {
  level: number;
  descTH: string;
  descEN: string;
}

export interface CourseInfo {
  courseNo: string;
  name: string;
  descTH: string;
  descENG: string;
  credit: number;
}

export interface CourseOverviewResponse {
  ok: boolean;
  course: CourseInfo;
  skillList: SkillItem[];
}

export interface CourseCredit {
  credits: number;
  lecture: number;
  practice: number;
  selfStudy: number;
}

export interface TeacherCourse {
  courseNo: string;
  name: string;
  descTH: string;
  descENG: string;
  credit: CourseCredit;
}

export interface TeacherCourseResponse {
  ok: boolean;
  id: string;
  teacherCourse: TeacherCourse[];
}
