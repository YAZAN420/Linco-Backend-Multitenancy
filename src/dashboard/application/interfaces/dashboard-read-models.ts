import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';
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
      role: 'TRAINEES' | 'MANAGERS' | 'OWNERS' | 'OTHER_ROLES';
      count: number;
      percentage: number;
    }>;
  };
}

export interface RecentCompanyReadModel {
  id: string;
  name: string;
  imagePath: string;
  plan: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd: Date;
  createdAt: Date;
  membersCount: number;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export type CompanyDisplayStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface RecentCompany extends RecentCompanyReadModel {
  initials: string;
  status: CompanyDisplayStatus;
  joinedAt: Date;
  ownerName: string;
}

export type DashboardActivityType =
  | 'COMPANY_APPROVED'
  | 'COURSE_PUBLISHED'
  | 'NEW_OWNER_JOINED'
  | 'USAGE_THRESHOLD_REACHED';

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  occurredAt: Date;
  entity: {
    type: 'COMPANY' | 'COURSE' | 'USER';
    id: string;
  };
  company?: { id: string; name: string };
  metadata?: {
    usedSeats: number;
    seatLimit: number;
    usagePercentage: number;
  };
}

export interface DashboardActivityReadModel {
  id: string;
  type: DashboardActivityType;
  occurredAt: Date;
  subjectName: string;
  entity: DashboardActivity['entity'];
  company?: DashboardActivity['company'];
  metadata?: DashboardActivity['metadata'];
}
