import {
  DashboardActivity,
  DashboardAnalytics,
  RecentCompany,
} from 'src/dashboard/application/interfaces/dashboard-read-models';

export class DashboardAnalyticsResponseDto {
  constructor(
    readonly summary: DashboardAnalytics['summary'],
    readonly activeLearnerGrowth: DashboardAnalytics['activeLearnerGrowth'],
    readonly userDistribution: DashboardAnalytics['userDistribution'],
  ) {}
}

export class RecentCompanyResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly initials: string,
    readonly imagePath: string,
    readonly plan: RecentCompany['plan'],
    readonly membersCount: number,
    readonly status: RecentCompany['status'],
    readonly subscriptionStatus: RecentCompany['subscriptionStatus'],
    readonly currentPeriodEnd: Date,
    readonly joinedAt: Date,
    readonly owner: { id: string; name: string },
  ) {}
}

export class DashboardActivityResponseDto {
  constructor(
    readonly id: string,
    readonly type: DashboardActivity['type'],
    readonly title: string,
    readonly description: string,
    readonly occurredAt: Date,
    readonly entity: DashboardActivity['entity'],
    readonly company?: DashboardActivity['company'],
    readonly metadata?: DashboardActivity['metadata'],
  ) {}
}
