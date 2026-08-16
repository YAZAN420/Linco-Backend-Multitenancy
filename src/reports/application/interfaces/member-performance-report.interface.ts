import {
  DemoMemberRole,
  DepartmentMemberRole,
  JobTitle,
} from 'src/generated/prisma/client';
import { MemberDepartmentReport } from './member-department-report.interface';

export interface MemberPerformanceReport {
  memberId: string;
  userId: string;
  fullName: string;
  email: string;
  demoRole: DemoMemberRole;
  joinedAt: Date;
  departments: MemberDepartmentReport[];
  departmentRoles: DepartmentMemberRole[];
  jobTitle: JobTitle[];
  assignedCourses: number;
  examAttempts: number;
  examsPassed: number;
  examsFailed: number;
  averageScore: number;
  highestScore: number;
  certificationsEarned: number;
  discussionQuestionsCount: number;
  discussionAnswersCount: number;
  messagesCount: number;
  inquiriesCount: number;
}
