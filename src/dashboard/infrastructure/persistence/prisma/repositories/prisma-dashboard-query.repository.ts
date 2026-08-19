import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { AnalyticsPeriod } from 'src/dashboard/application/interfaces/dashboard-analytics.query';
import {
  DashboardSummaryCounts,
  LearnerGrowthCount,
  UserDistributionCounts,
} from 'src/dashboard/application/interfaces/dashboard-read-models';
import { DashboardQueryRepository } from 'src/dashboard/application/ports/dashboard-query.repository';
import { PrismaDashboardAnalyticsMapper } from '../mappers/prisma-dashboard-analytics.mapper';
import {
  DashboardPlatformHealthSnapshot,
  LearningEngagementPoint,
} from 'src/dashboard/application/interfaces/dashboard-report-read-models';

@Injectable()
export class PrismaDashboardQueryRepository implements DashboardQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDashboardAnalyticsMapper,
  ) {}

  async getSummaryCounts(): Promise<DashboardSummaryCounts> {
    const row = await this.prisma.dashboardSummaryView.findUnique({
      where: { id: 'dashboard-summary' },
    });

    return this.mapper.toSummaryCounts(row);
  }

  async getLearnerGrowth(
    period: AnalyticsPeriod,
  ): Promise<LearnerGrowthCount[]> {
    const rows = await this.prisma.dashboardLearnerGrowthView.findMany({
      where: { period },
      orderBy: { bucketIndex: 'asc' },
    });

    return this.mapper.toLearnerGrowth(rows);
  }

  async getUserDistribution(): Promise<UserDistributionCounts> {
    const rows = await this.prisma.dashboardUserDistributionView.findMany();
    return this.mapper.toUserDistribution(rows);
  }

  async getLearningEngagement(): Promise<LearningEngagementPoint[]> {
    const rows = await this.prisma.dashboardLearningEngagementView.findMany({
      orderBy: { bucketIndex: 'asc' },
    });

    return this.mapper.toLearningEngagement(rows);
  }

  async getPlatformHealth(): Promise<DashboardPlatformHealthSnapshot> {
    const row = await this.prisma.dashboardPlatformHealthView.findUnique({
      where: { id: 'platform-health' },
    });

    return this.mapper.toPlatformHealth(row);
  }
}
