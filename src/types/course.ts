export interface SkillItem {
  no: string;
  skillTitle: string;
  skillDescriptionEN: string;
  skillDescriptionTH: string;
  skillType: string;
  skillLevel: number;
}

export interface CourseInfo {
  courseNo: string;
  courseNameEN: string;
  courseNameTH: string;
  courseDetailEN: string;
  courseDetailTH: string;
  credit: number;
}

export interface CourseOverviewResponse {
  ok: boolean;
  course: CourseInfo;
  skillList: SkillItem[];
}
