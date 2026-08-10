import { PageDto } from 'src/common/dtos/pagination';
import { AnalyticsPeriod } from '../interfaces/dashboard-analytics.query';
import {
  DashboardActivityReadModel,
  DashboardSummaryCounts,
  LearnerGrowthCount,
  RecentCompanyReadModel,
  UserDistributionCounts,
} from '../interfaces/dashboard-read-models';
import { FindDashboardPageQuery } from '../interfaces/find-dashboard.query';

export abstract class DashboardQueryRepository {
  abstract getSummaryCounts(
    comparisonAt: Date,
  ): Promise<DashboardSummaryCounts>;

  abstract getLearnerGrowth(
    period: AnalyticsPeriod,
    now: Date,
  ): Promise<LearnerGrowthCount[]>;

  abstract getUserDistribution(): Promise<UserDistributionCounts>;

  abstract findRecentlyJoinedCompanies(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<RecentCompanyReadModel>>;

  abstract findRecentActivity(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<DashboardActivityReadModel>>;
}
