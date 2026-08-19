import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { AnalyticsPeriod } from 'src/dashboard/application/interfaces/dashboard-analytics.query';
import { PrismaDashboardAnalyticsMapper } from '../mappers/prisma-dashboard-analytics.mapper';
import { PrismaDashboardQueryRepository } from './prisma-dashboard-query.repository';

describe('PrismaDashboardQueryRepository', () => {
  let prisma: {
    dashboardSummaryView: { findUnique: jest.Mock };
    dashboardLearnerGrowthView: { findMany: jest.Mock };
    dashboardUserDistributionView: { findMany: jest.Mock };
  };
  let repository: PrismaDashboardQueryRepository;

  beforeEach(() => {
    prisma = {
      dashboardSummaryView: { findUnique: jest.fn() },
      dashboardLearnerGrowthView: { findMany: jest.fn() },
      dashboardUserDistributionView: { findMany: jest.fn() },
    };
    repository = new PrismaDashboardQueryRepository(
      prisma as unknown as PrismaService,
      new PrismaDashboardAnalyticsMapper(),
    );
  });

  it('reads summary metrics only from the dashboard summary view', async () => {
    prisma.dashboardSummaryView.findUnique.mockResolvedValue({
      id: 'dashboard-summary',
      registeredCompaniesCurrent: 128,
      registeredCompaniesPrevious: 114,
      activeLearnersCurrent: 8426,
      activeLearnersPrevious: 7788,
      publishedCoursesCurrent: 412,
      publishedCoursesPrevious: 387,
      completedLearnersCurrent: 6606,
      completedLearnersPrevious: 6010,
    });

    await expect(repository.getSummaryCounts()).resolves.toEqual({
      registeredCompanies: { current: 128, previous: 114 },
      activeLearners: { current: 8426, previous: 7788 },
      publishedCourses: { current: 412, previous: 387 },
      completedLearners: { current: 6606, previous: 6010 },
    });
    expect(prisma.dashboardSummaryView.findUnique).toHaveBeenCalledWith({
      where: { id: 'dashboard-summary' },
    });
  });

  it('filters and orders the growth view by the requested period', async () => {
    prisma.dashboardLearnerGrowthView.findMany.mockResolvedValue([
      {
        id: '6M:0',
        period: '6M',
        bucketIndex: 0,
        date: new Date('2026-03-01T00:00:00.000Z'),
        value: 7000,
      },
    ]);

    await expect(
      repository.getLearnerGrowth(AnalyticsPeriod.SIX_MONTHS),
    ).resolves.toEqual([
      { date: new Date('2026-03-01T00:00:00.000Z'), value: 7000 },
    ]);
    expect(prisma.dashboardLearnerGrowthView.findMany).toHaveBeenCalledWith({
      where: { period: AnalyticsPeriod.SIX_MONTHS },
      orderBy: { bucketIndex: 'asc' },
    });
  });

  it('maps the mutually exclusive user-distribution view rows', async () => {
    prisma.dashboardUserDistributionView.findMany.mockResolvedValue([
      { id: 'TRAINEES', role: 'TRAINEES', count: 58, total: 100 },
      { id: 'MANAGERS', role: 'MANAGERS', count: 20, total: 100 },
      { id: 'OWNERS', role: 'OWNERS', count: 13, total: 100 },
      { id: 'OTHER_ROLES', role: 'OTHER_ROLES', count: 9, total: 100 },
    ]);

    await expect(repository.getUserDistribution()).resolves.toEqual({
      total: 100,
      trainees: 58,
      managers: 20,
      owners: 13,
      otherRoles: 9,
    });
  });
});
