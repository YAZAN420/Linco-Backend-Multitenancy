export interface DemoOwnerReport {
  generatedAt: Date;
  totalMembers: number;
  newMembers: number;
  totalDepartments: number;
  totalCourses: number;
  publishedCourses: number;
  totalCertifications: number;
  certificationRate: number;
  totalExamAttempts: number;
  examPassRate: number;
  averageExamScore: number;
}

export type { CoursePerformanceReport } from './course-performance-report.interface';
export type { DepartmentPerformanceReport } from './department-performance-report.interface';
export type { MemberDepartmentReport } from './member-department-report.interface';
export type { MemberPerformanceReport } from './member-performance-report.interface';
