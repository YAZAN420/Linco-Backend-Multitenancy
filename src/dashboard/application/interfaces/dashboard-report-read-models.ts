export interface LearningEngagementPoint {
  date: Date;
  activeLearners: number;
  completedLearningPaths: number;
}

export interface DashboardPlatformHealthSnapshot {
  periodStart: Date;
  apiAvailability: number | null;
  courseCompletion: number;
  workspaceActivation: number;
  supportResponseSla: number;
  courseAssignments: number;
  completedCourseAssignments: number;
  totalWorkspaces: number;
  activatedWorkspaces: number;
  supportInquiries: number;
  supportResponsesWithinSla: number;
}

export type DashboardReportKey =
  'COMPANY_ADOPTION' | 'LEARNER_PERFORMANCE' | 'CONTENT_PERFORMANCE';

export interface DashboardReports {
  learningEngagement: {
    period: 'LAST_SIX_MONTHS';
    points: Array<
      LearningEngagementPoint & {
        label: string;
      }
    >;
  };
  platformHealth: {
    period: 'CURRENT_MONTH';
    periodStart: Date;
    apiAvailability: {
      value: number | null;
      measured: boolean;
    };
    courseCompletion: {
      value: number;
      completedAssignments: number;
      totalAssignments: number;
    };
    workspaceActivation: {
      value: number;
      activatedWorkspaces: number;
      totalWorkspaces: number;
    };
    supportResponseSla: {
      value: number;
      responsesWithinSla: number;
      totalInquiries: number;
      targetHours: 24;
    };
  };
  reportCatalog: Array<{
    key: DashboardReportKey;
    title: string;
    description: string;
  }>;
}
