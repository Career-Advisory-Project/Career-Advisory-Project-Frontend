export interface AllCourseData{
  courses:CourseInfo[];
}

export interface CourseInfo {
  courseNo: string;
  name:string;
  descTH: string;
  descENG: string;
  credit: number;
  hasCourse:boolean;
}
export interface CourseSkillResponse {
  id: string;
  courseNo: string;
  name: string;
  descTH: string;
  descENG: string;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  descTH: string;
  descENG: string;
  tags: string[];
  rubrics: SkillRubric[];
}

export interface SkillRubric {
  level: number;
  descTH: string;
  descENG: string;
}

export interface CourseCredit {
  credits: number;
  lecture: number;
  practice: number;
  selfStudy: number;
}

export interface TeacherCourse {
  courseNo: string;
  descENG: string;
  descTH: string;
  name: string;
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
}
