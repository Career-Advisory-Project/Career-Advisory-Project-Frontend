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
  courseNameTH: string;
  courseNameEN: string;
  detailTH: string;
  detailEN: string;
  credit: CourseCredit;
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
  courseNameTH: string;
  courseNameEN: string;
  detailTH: string;
  detailEN: string;
  credit: CourseCredit;
}

export interface TeacherCourseResponse {
  ok: boolean;
  id: string;
  titleTH: string;
  titleEN: string;
  firstNameTH: string;
  firstNameEN: string;
  lastNameTH: string;
  lastNameEN: string;
  courses: TeacherCourse[];
  // teacherCourse: TeacherCourse[];
}
