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
