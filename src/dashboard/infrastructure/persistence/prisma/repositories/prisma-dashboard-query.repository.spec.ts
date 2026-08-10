import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { AnalyticsPeriod } from 'src/dashboard/application/interfaces/dashboard-analytics.query';
import { PrismaDashboardQueryRepository } from './prisma-dashboard-query.repository';

describe('PrismaDashboardQueryRepository', () => {
  let prisma: {
    demo: { count: jest.Mock; findMany: jest.Mock };
    user: { count: jest.Mock };
    course: { count: jest.Mock; findMany: jest.Mock };
    payment: { count: jest.Mock; findMany: jest.Mock };
  };
  let repository: PrismaDashboardQueryRepository;

  beforeEach(() => {
    prisma = {
      demo: { count: jest.fn(), findMany: jest.fn() },
      user: { count: jest.fn() },
      course: { count: jest.fn(), findMany: jest.fn() },
      payment: { count: jest.fn(), findMany: jest.fn() },
    };
    repository = new PrismaDashboardQueryRepository(
      prisma as unknown as PrismaService,
    );
  });

  it('builds summary counts using ORM aggregate queries', async () => {
    prisma.demo.count.mockResolvedValueOnce(10).mockResolvedValueOnce(8);
    prisma.user.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(80)
      .mockResolvedValueOnce(60)
      .mockResolvedValueOnce(45);
    prisma.course.count.mockResolvedValueOnce(20).mockResolvedValueOnce(15);

    const result = await repository.getSummaryCounts(
      new Date('2026-07-10T00:00:00.000Z'),
    );

    expect(result).toEqual({
      registeredCompanies: { current: 10, previous: 8 },
      activeLearners: { current: 100, previous: 80 },
      publishedCourses: { current: 20, previous: 15 },
      completedLearners: { current: 60, previous: 45 },
    });
    expect(prisma.demo.count).toHaveBeenCalledTimes(2);
    expect(prisma.user.count).toHaveBeenCalledTimes(4);
    expect(prisma.course.count).toHaveBeenCalledTimes(2);
  });

  it.each([
    [AnalyticsPeriod.SEVEN_DAYS, 7],
    [AnalyticsPeriod.SIX_MONTHS, 6],
    [AnalyticsPeriod.ONE_YEAR, 12],
  ])('returns zero-filled growth buckets for %s', async (period, count) => {
    prisma.user.count.mockResolvedValue(0);

    const result = await repository.getLearnerGrowth(
      period,
      new Date('2026-08-10T12:00:00.000Z'),
    );

    expect(result).toHaveLength(count);
    expect(result.every((point) => point.value === 0)).toBe(true);
    expect(prisma.user.count).toHaveBeenCalledTimes(count);
  });

  it('keeps user distribution categories mutually exclusive', async () => {
    prisma.user.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(60);

    await expect(repository.getUserDistribution()).resolves.toEqual({
      total: 100,
      owners: 10,
      managers: 20,
      trainees: 60,
      otherRoles: 10,
    });
  });

  it('returns standard pagination for recent activity with no records', async () => {
    prisma.payment.findMany.mockResolvedValue([]);
    prisma.payment.count.mockResolvedValue(0);
    prisma.course.findMany.mockResolvedValue([]);
    prisma.course.count.mockResolvedValue(0);
    prisma.demo.findMany.mockResolvedValue([]);
    prisma.demo.count.mockResolvedValue(0);

    const result = await repository.findRecentActivity({ page: 1, take: 5 });

    expect(result.data).toEqual([]);
    expect(result.meta).toMatchObject({
      page: 1,
      take: 5,
      itemCount: 0,
      pageCount: 0,
      hasNextPage: false,
    });
  });
});
