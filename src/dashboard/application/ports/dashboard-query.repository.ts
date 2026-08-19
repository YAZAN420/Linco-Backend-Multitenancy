import { AnalyticsPeriod } from '../interfaces/dashboard-analytics.query';
import {
  DashboardSummaryCounts,
  LearnerGrowthCount,
  UserDistributionCounts,
} from '../interfaces/dashboard-read-models';

export abstract class DashboardQueryRepository {
  abstract getSummaryCounts(): Promise<DashboardSummaryCounts>;

  abstract getLearnerGrowth(
    period: AnalyticsPeriod,
  ): Promise<LearnerGrowthCount[]>;

  abstract getUserDistribution(): Promise<UserDistributionCounts>;
}
