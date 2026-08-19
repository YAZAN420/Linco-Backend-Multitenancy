import { AnalyticsPeriod } from './dashboard-analytics.query';

export interface CountComparison {
  current: number;
  previous: number;
}

export interface DashboardSummaryCounts {
  registeredCompanies: CountComparison;
  activeLearners: CountComparison;
  publishedCourses: CountComparison;
  completedLearners: CountComparison;
}

export interface LearnerGrowthCount {
  date: Date;
  value: number;
}

export interface UserDistributionCounts {
  total: number;
  trainees: number;
  managers: number;
  owners: number;
  otherRoles: number;
}

export interface DashboardMetric {
  value: number;
  changePercentage: number;
}

export type UserDistributionRole =
  'TRAINEES' | 'MANAGERS' | 'OWNERS' | 'OTHER_ROLES';

export interface DashboardAnalytics {
  summary: {
    registeredCompanies: DashboardMetric;
    activeLearners: DashboardMetric;
    publishedCourses: DashboardMetric;
    completionRate: DashboardMetric;
  };
  activeLearnerGrowth: {
    period: AnalyticsPeriod;
    total: number;
    changePercentage: number;
    points: Array<{ date: Date; label: string; value: number }>;
  };
  userDistribution: {
    total: number;
    items: Array<{
      role: UserDistributionRole;
      count: number;
      percentage: number;
    }>;
  };
}
