import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { AnalyticsPeriod } from 'src/dashboard/application/interfaces/dashboard-analytics.query';
import { FindDashboardPageQuery } from 'src/dashboard/application/interfaces/find-dashboard.query';
import {
  DashboardActivityReadModel,
  DashboardSummaryCounts,
  LearnerGrowthCount,
  RecentCompanyReadModel,
  UserDistributionCounts,
} from 'src/dashboard/application/interfaces/dashboard-read-models';
import { DashboardQueryRepository } from 'src/dashboard/application/ports/dashboard-query.repository';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';
import {
  DemoMemberRole,
  DepartmentMemberRole,
  PaymentStatus,
  PaymentType,
  PlanTier as PrismaPlanTier,
} from 'src/generated/prisma/client';
import type { Prisma } from 'src/generated/prisma/client';

type UsageCompanySummary = {
  id: string;
  name: string;
  plan: PrismaPlanTier;
  _count: { members: number };
};

type UsageThresholdRow = {
  id: string;
  name: string;
  members: Array<{ joinedAt: Date }>;
};

@Injectable()
export class PrismaDashboardQueryRepository implements DashboardQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSummaryCounts(comparisonAt: Date): Promise<DashboardSummaryCounts> {
    const [
      registeredCurrent,
      registeredPrevious,
      learnersCurrent,
      learnersPrevious,
      coursesCurrent,
      coursesPrevious,
      completedCurrent,
      completedPrevious,
    ] = await Promise.all([
      this.prisma.demo.count(),
      this.prisma.demo.count({ where: { createdAt: { lte: comparisonAt } } }),
      this.prisma.user.count({
        where: {
          demoMemberships: { some: { role: DemoMemberRole.MEMBER } },
        },
      }),
      this.prisma.user.count({
        where: {
          demoMemberships: {
            some: {
              role: DemoMemberRole.MEMBER,
              joinedAt: { lte: comparisonAt },
            },
          },
        },
      }),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.course.count({
        where: { isPublished: true, createdAt: { lte: comparisonAt } },
      }),
      this.prisma.user.count({
        where: {
          demoMemberships: {
            some: {
              role: DemoMemberRole.MEMBER,
              certifications: { some: {} },
            },
          },
        },
      }),
      this.prisma.user.count({
        where: {
          demoMemberships: {
            some: {
              role: DemoMemberRole.MEMBER,
              certifications: { some: { issuedAt: { lte: comparisonAt } } },
            },
          },
        },
      }),
    ]);

    return {
      registeredCompanies: {
        current: registeredCurrent,
        previous: registeredPrevious,
      },
      activeLearners: {
        current: learnersCurrent,
        previous: learnersPrevious,
      },
      publishedCourses: {
        current: coursesCurrent,
        previous: coursesPrevious,
      },
      completedLearners: {
        current: completedCurrent,
        previous: completedPrevious,
      },
    };
  }

  async getLearnerGrowth(
    period: AnalyticsPeriod,
    now: Date,
  ): Promise<LearnerGrowthCount[]> {
    const buckets = this.growthBuckets(period, now);
    const values = await Promise.all(
      buckets.map(({ end }) =>
        this.prisma.user.count({
          where: {
            demoMemberships: {
              some: {
                role: DemoMemberRole.MEMBER,
                joinedAt: { lte: end },
              },
            },
          },
        }),
      ),
    );

    return buckets.map(({ date }, index) => ({ date, value: values[index] }));
  }

  async getUserDistribution(): Promise<UserDistributionCounts> {
    const ownerFilter: Prisma.UserWhereInput = {
      demoMemberships: { some: { role: DemoMemberRole.OWNER } },
    };
    const managerFilter: Prisma.UserWhereInput = {
      AND: [
        { demoMemberships: { none: { role: DemoMemberRole.OWNER } } },
        {
          OR: [
            { demoMemberships: { some: { role: DemoMemberRole.ADMIN } } },
            {
              demoMemberships: {
                some: {
                  accessibleDepartments: {
                    some: { role: DepartmentMemberRole.MANAGER },
                  },
                },
              },
            },
          ],
        },
      ],
    };
    const traineeFilter: Prisma.UserWhereInput = {
      AND: [
        { demoMemberships: { none: { role: DemoMemberRole.OWNER } } },
        { demoMemberships: { none: { role: DemoMemberRole.ADMIN } } },
        {
          demoMemberships: {
            none: {
              accessibleDepartments: {
                some: { role: DepartmentMemberRole.MANAGER },
              },
            },
          },
        },
        { demoMemberships: { some: { role: DemoMemberRole.MEMBER } } },
      ],
    };

    const [total, owners, managers, trainees] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: ownerFilter }),
      this.prisma.user.count({ where: managerFilter }),
      this.prisma.user.count({ where: traineeFilter }),
    ]);

    return {
      total,
      trainees,
      managers,
      owners,
      otherRoles: total - trainees - managers - owners,
    };
  }

  async findRecentlyJoinedCompanies(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<RecentCompanyReadModel>> {
    const skip = (options.page - 1) * options.take;
    const [companies, itemCount] = await Promise.all([
      this.prisma.demo.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          name: true,
          imagePath: true,
          plan: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: { select: { members: true } },
        },
      }),
      this.prisma.demo.count(),
    ]);

    const data: RecentCompanyReadModel[] = companies.map((company) => ({
      id: company.id,
      name: company.name,
      imagePath: company.imagePath,
      plan: company.plan as PlanTier,
      subscriptionStatus: company.subscriptionStatus as SubscriptionStatus,
      currentPeriodEnd: company.currentPeriodEnd,
      createdAt: company.createdAt,
      membersCount: company._count.members,
      owner: company.owner,
    }));

    return new PageDto(
      data,
      new PageMetaDto({ pageOptionsDto: options, itemCount }),
    );
  }

  async findRecentActivity(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<DashboardActivityReadModel>> {
    const skip = (options.page - 1) * options.take;
    const candidateLimit = skip + options.take;

    const [
      approvals,
      approvalCount,
      courses,
      courseCount,
      companies,
      companyCount,
      usageCompanies,
    ] = await Promise.all([
      this.prisma.payment.findMany({
        where: {
          type: PaymentType.SUBSCRIPTION,
          status: PaymentStatus.SUCCESSFUL,
          demoId: { not: null },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: candidateLimit,
        select: {
          id: true,
          updatedAt: true,
          demo: { select: { id: true, name: true } },
        },
      }),
      this.prisma.payment.count({
        where: {
          type: PaymentType.SUBSCRIPTION,
          status: PaymentStatus.SUCCESSFUL,
          demoId: { not: null },
        },
      }),
      this.prisma.course.findMany({
        where: { isPublished: true },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take: candidateLimit,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          demo: { select: { id: true, name: true } },
        },
      }),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.demo.findMany({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: candidateLimit,
        select: {
          id: true,
          createdAt: true,
          owner: { select: { id: true, firstName: true, lastName: true } },
          name: true,
        },
      }),
      this.prisma.demo.count(),
      this.prisma.demo.findMany({
        select: {
          id: true,
          name: true,
          plan: true,
          _count: { select: { members: true } },
        },
      }),
    ]);

    const activities: DashboardActivityReadModel[] = [];

    for (const approval of approvals) {
      if (!approval.demo) continue;
      activities.push({
        id: `company-approved:${approval.id}`,
        type: 'COMPANY_APPROVED',
        occurredAt: approval.updatedAt,
        subjectName: approval.demo.name,
        entity: { type: 'COMPANY', id: approval.demo.id },
        company: approval.demo,
      });
    }

    for (const course of courses) {
      activities.push({
        id: `course-published:${course.id}`,
        type: 'COURSE_PUBLISHED',
        occurredAt: course.updatedAt,
        subjectName: course.title,
        entity: { type: 'COURSE', id: course.id },
        company: course.demo,
      });
    }

    for (const company of companies) {
      const ownerName =
        `${company.owner.firstName} ${company.owner.lastName}`.trim();
      activities.push({
        id: `owner-joined:${company.id}`,
        type: 'NEW_OWNER_JOINED',
        occurredAt: company.createdAt,
        subjectName: ownerName,
        entity: { type: 'USER', id: company.owner.id },
        company: { id: company.id, name: company.name },
      });
    }

    const usageActivities = await this.buildUsageActivities(usageCompanies);
    activities.push(...usageActivities);

    activities.sort(
      (left, right) =>
        right.occurredAt.getTime() - left.occurredAt.getTime() ||
        right.id.localeCompare(left.id),
    );

    const itemCount =
      approvalCount + courseCount + companyCount + usageActivities.length;

    return new PageDto(
      activities.slice(skip, skip + options.take),
      new PageMetaDto({ pageOptionsDto: options, itemCount }),
    );
  }

  private findUsageThresholdRows(ids: string[], threshold: number) {
    if (ids.length === 0) return Promise.resolve<UsageThresholdRow[]>([]);

    return this.prisma.demo.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        members: {
          orderBy: [{ joinedAt: 'asc' }, { id: 'asc' }],
          skip: threshold - 1,
          take: 1,
          select: { joinedAt: true },
        },
      },
    });
  }

  private async buildUsageActivities(
    companies: UsageCompanySummary[],
  ): Promise<DashboardActivityReadModel[]> {
    const eligibleCompanies = companies.filter((company) => {
      const seatLimit = this.seatLimit(company.plan);
      return company._count.members >= Math.ceil(seatLimit * 0.9);
    });
    const groups = [
      { seatLimit: 5, threshold: 5 },
      { seatLimit: 25, threshold: 23 },
      { seatLimit: 100, threshold: 90 },
    ];
    const thresholdRows = await Promise.all(
      groups.map(({ seatLimit, threshold }) =>
        this.findUsageThresholdRows(
          eligibleCompanies
            .filter((company) => this.seatLimit(company.plan) === seatLimit)
            .map((company) => company.id),
          threshold,
        ),
      ),
    );
    const companyById = new Map(
      eligibleCompanies.map((company) => [company.id, company]),
    );

    return thresholdRows.flat().flatMap((row) => {
      const company = companyById.get(row.id);
      const thresholdMembership = row.members[0];
      if (!company || !thresholdMembership) return [];

      const seatLimit = this.seatLimit(company.plan);
      const usagePercentage = Math.round(
        (company._count.members / seatLimit) * 100,
      );
      return [
        {
          id: `usage-threshold:${company.id}`,
          type: 'USAGE_THRESHOLD_REACHED',
          occurredAt: thresholdMembership.joinedAt,
          subjectName: company.name,
          entity: { type: 'COMPANY', id: company.id },
          company: { id: company.id, name: company.name },
          metadata: {
            usedSeats: company._count.members,
            seatLimit,
            usagePercentage,
          },
        },
      ];
    });
  }

  private seatLimit(plan: PrismaPlanTier): number {
    if (plan === PrismaPlanTier.ENTERPRISE) return 100;
    if (plan === PrismaPlanTier.PRO) return 25;
    return 5;
  }

  private growthBuckets(
    period: AnalyticsPeriod,
    now: Date,
  ): Array<{ date: Date; end: Date }> {
    if (period === AnalyticsPeriod.SEVEN_DAYS) {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 6 + index,
          ),
        );
        return {
          date,
          end: index === 6 ? now : new Date(date.getTime() + 86_400_000 - 1),
        };
      });
    }

    const count = period === AnalyticsPeriod.ONE_YEAR ? 12 : 6;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() - count + index + 1,
          1,
        ),
      );
      const isCurrentMonth = index === count - 1;
      return {
        date,
        end: isCurrentMonth
          ? now
          : new Date(
              Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1) - 1,
            ),
      };
    });
  }
}
