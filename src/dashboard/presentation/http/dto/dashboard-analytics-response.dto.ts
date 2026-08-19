import { DashboardAnalytics } from 'src/dashboard/application/interfaces/dashboard-read-models';

export class DashboardAnalyticsResponseDto {
  constructor(
    readonly summary: DashboardAnalytics['summary'],
    readonly activeLearnerGrowth: DashboardAnalytics['activeLearnerGrowth'],
    readonly userDistribution: DashboardAnalytics['userDistribution'],
  ) {}
}
