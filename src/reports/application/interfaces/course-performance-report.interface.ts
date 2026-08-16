import { CourseVisibility } from 'src/generated/prisma/client';

export interface CoursePerformanceReport {
  courseId: string;
  courseTitle: string;
  isPublished: boolean;
  visibility: CourseVisibility;
  departmentCount: number;
  assignedMemberCount: number;
  sectionCount: number;
  lessonCount: number;
  totalDuration: number;
  examCount: number;
  membersAttempted: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  certificationsIssued: number;
  certificationRate: number;
}
