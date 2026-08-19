import { AnalyticsPeriod } from './interfaces/dashboard-analytics.query';
import { DashboardQueryRepository } from './ports/dashboard-query.repository';
import { DashboardQueryService } from './dashboard-query.service';

describe('DashboardQueryService', () => {
  let repository: {
    getSummaryCounts: jest.Mock;
    getLearnerGrowth: jest.Mock;
    getUserDistribution: jest.Mock;
  };
  let service: DashboardQueryService;

  beforeEach(() => {
    repository = {
      getSummaryCounts: jest.fn(),
      getLearnerGrowth: jest.fn(),
      getUserDistribution: jest.fn(),
    };
    service = new DashboardQueryService(
      repository as unknown as DashboardQueryRepository,
    );
  });

  it('builds all dashboard analytics from the view-backed read models', async () => {
    repository.getSummaryCounts.mockResolvedValue({
      registeredCompanies: { current: 120, previous: 100 },
      activeLearners: { current: 100, previous: 80 },
      publishedCourses: { current: 40, previous: 32 },
      completedLearners: { current: 75, previous: 40 },
    });
    repository.getLearnerGrowth.mockResolvedValue([
      { date: new Date('2026-01-01T00:00:00.000Z'), value: 80 },
      { date: new Date('2026-02-01T00:00:00.000Z'), value: 100 },
    ]);
    repository.getUserDistribution.mockResolvedValue({
      total: 100,
      trainees: 58,
      managers: 20,
      owners: 13,
      otherRoles: 9,
    });

    await expect(
      service.getAnalytics(AnalyticsPeriod.SIX_MONTHS),
    ).resolves.toEqual({
      summary: {
        registeredCompanies: { value: 120, changePercentage: 20 },
        activeLearners: { value: 100, changePercentage: 25 },
        publishedCourses: { value: 40, changePercentage: 25 },
        completionRate: { value: 75, changePercentage: 25 },
      },
      activeLearnerGrowth: {
        period: AnalyticsPeriod.SIX_MONTHS,
        total: 100,
        changePercentage: 25,
        points: [
          {
            date: new Date('2026-01-01T00:00:00.000Z'),
            label: 'Jan',
            value: 80,
          },
          {
            date: new Date('2026-02-01T00:00:00.000Z'),
            label: 'Feb',
            value: 100,
          },
        ],
      },
      userDistribution: {
        total: 100,
        items: [
          { role: 'TRAINEES', count: 58, percentage: 58 },
          { role: 'MANAGERS', count: 20, percentage: 20 },
          { role: 'OWNERS', count: 13, percentage: 13 },
          { role: 'OTHER_ROLES', count: 9, percentage: 9 },
        ],
      },
    });
    expect(repository.getLearnerGrowth).toHaveBeenCalledWith(
      AnalyticsPeriod.SIX_MONTHS,
    );
  });

  it('returns zero percentages when the dashboard has no users', async () => {
    repository.getSummaryCounts.mockResolvedValue({
      registeredCompanies: { current: 0, previous: 0 },
      activeLearners: { current: 0, previous: 0 },
      publishedCourses: { current: 0, previous: 0 },
      completedLearners: { current: 0, previous: 0 },
    });
    repository.getLearnerGrowth.mockResolvedValue([]);
    repository.getUserDistribution.mockResolvedValue({
      total: 0,
      trainees: 0,
      managers: 0,
      owners: 0,
      otherRoles: 0,
    });

    const result = await service.getAnalytics(AnalyticsPeriod.SEVEN_DAYS);

    expect(result.summary.completionRate).toEqual({
      value: 0,
      changePercentage: 0,
    });
    expect(
      result.userDistribution.items.every((item) => item.percentage === 0),
    ).toBe(true);
  });
});
