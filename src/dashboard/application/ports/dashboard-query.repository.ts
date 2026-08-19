import { AnalyticsPeriod } from '../interfaces/dashboard-analytics.query';
import {
  DashboardSummaryCounts,
  LearnerGrowthCount,
  UserDistributionCounts,
} from '../interfaces/dashboard-read-models';
import {
  DashboardPlatformHealthSnapshot,
  LearningEngagementPoint,
} from '../interfaces/dashboard-report-read-models';

export abstract class DashboardQueryRepository {
  abstract getSummaryCounts(): Promise<DashboardSummaryCounts>;

  abstract getLearnerGrowth(
    period: AnalyticsPeriod,
  ): Promise<LearnerGrowthCount[]>;

  abstract getUserDistribution(): Promise<UserDistributionCounts>;

  abstract getLearningEngagement(): Promise<LearningEngagementPoint[]>;

  abstract getPlatformHealth(): Promise<DashboardPlatformHealthSnapshot>;
}
