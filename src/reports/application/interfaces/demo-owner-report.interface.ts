import {
  CourseVisibility,
  DemoMemberRole,
  DepartmentMemberRole,
  JobTitle,
} from 'src/generated/prisma/client';

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

export interface MemberDepartmentReport {
  departmentId: string;
  departmentName: string;
}

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

export interface DepartmentPerformanceReport {
  departmentId: string;
  departmentName: string;
  manager: string;
  memberCount: number;
  assignedCourseCount: number;
  membersWithAttempts: number;
  examAttempts: number;
  averageExamScore: number;
  examPassRate: number;
  certificationsEarned: number;
  discussionActivity: number;
  messageActivity: number;
  scheduledLiveStreams: number;
  completedLiveStreams: number;
}
