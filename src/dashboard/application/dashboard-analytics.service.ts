import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  DemoMemberRole,
  PaymentStatus,
  PaymentType,
  PlanTier,
  SubscriptionStatus,
} from 'src/generated/prisma/enums';
import { AnalyticsPeriod } from '../presentation/http/dto/dashboard-analytics-query.dto';

type DatedId = { userId: string; joinedAt: Date };

@Injectable()
export class DashboardAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics(period: AnalyticsPeriod) {
    const now = new Date();
    const comparisonDate = this.addUtcDays(now, -30);

    const [demos, members, publishedCourses, certifications, users] =
      await Promise.all([
        this.prisma.demo.findMany({ select: { createdAt: true } }),
        this.prisma.demoMember.findMany({
          select: { id: true, userId: true, role: true, joinedAt: true },
        }),
        this.prisma.course.findMany({
          where: { isPublished: true },
          select: { createdAt: true },
        }),
        this.prisma.certification.findMany({
          select: {
            issuedAt: true,
            demoMember: { select: { userId: true, role: true } },
          },
        }),
        this.prisma.user.findMany({ select: { id: true } }),
      ]);

    const learnerMemberships = members.filter(
      (member) => member.role === DemoMemberRole.MEMBER,
    );
    const activeLearners = new Set(
      learnerMemberships.map((member) => member.userId),
    ).size;
    const previousActiveLearners = this.uniqueUsersAt(
      learnerMemberships,
      comparisonDate,
    );

    const currentCompletedLearners = new Set(
      certifications
        .filter(
          (certification) =>
            certification.demoMember.role === DemoMemberRole.MEMBER,
        )
        .map((certification) => certification.demoMember.userId),
    ).size;
    const previousCompletedLearners = new Set(
      certifications
        .filter(
          (certification) =>
            certification.demoMember.role === DemoMemberRole.MEMBER &&
            certification.issuedAt <= comparisonDate,
        )
        .map((certification) => certification.demoMember.userId),
    ).size;

    const completionRate = this.percentage(
      currentCompletedLearners,
      activeLearners,
    );
    const previousCompletionRate = this.percentage(
      previousCompletedLearners,
      previousActiveLearners,
    );

    const distribution = this.buildUserDistribution(users, members);
    const growth = this.buildLearnerGrowth(learnerMemberships, period, now);

    return {
      summary: {
        registeredCompanies: {
          value: demos.length,
          changePercentage: this.growthPercentage(
            demos.length,
            demos.filter((demo) => demo.createdAt <= comparisonDate).length,
          ),
        },
        activeLearners: {
          value: activeLearners,
          changePercentage: this.growthPercentage(
            activeLearners,
            previousActiveLearners,
          ),
        },
        publishedCourses: {
          value: publishedCourses.length,
          changePercentage: this.growthPercentage(
            publishedCourses.length,
            publishedCourses.filter(
              (course) => course.createdAt <= comparisonDate,
            ).length,
          ),
        },
        completionRate: {
          value: completionRate,
          changePercentage: this.round(completionRate - previousCompletionRate),
        },
      },
      activeLearnerGrowth: {
        period,
        total: activeLearners,
        changePercentage: this.growthPercentage(
          activeLearners,
          previousActiveLearners,
        ),
        points: growth,
      },
      userDistribution: distribution,
    };
  }

  async getRecentlyJoinedCompanies(take: number) {
    const [companies, total] = await Promise.all([
      this.prisma.demo.findMany({
        orderBy: { createdAt: 'desc' },
        take,
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

    return {
      items: companies.map((company) => ({
        id: company.id,
        name: company.name,
        initials: this.initials(company.name),
        imagePath: company.imagePath,
        plan: company.plan,
        membersCount: company._count.members,
        status: this.companyStatus(
          company.subscriptionStatus,
          company.currentPeriodEnd,
        ),
        subscriptionStatus: company.subscriptionStatus,
        currentPeriodEnd: company.currentPeriodEnd,
        joinedAt: company.createdAt,
        owner: {
          id: company.owner.id,
          name: `${company.owner.firstName} ${company.owner.lastName}`.trim(),
        },
      })),
      total,
    };
  }

  async getRecentActivity(take: number) {
    const candidateTake = Math.min(take + 1, 51);
    const [subscriptionPayments, courses, owners, usageCandidates] =
      await Promise.all([
        this.prisma.payment.findMany({
          where: {
            type: PaymentType.SUBSCRIPTION,
            status: PaymentStatus.SUCCESSFUL,
            demoId: { not: null },
          },
          orderBy: { updatedAt: 'desc' },
          take: candidateTake,
          select: {
            id: true,
            updatedAt: true,
            demo: { select: { id: true, name: true } },
          },
        }),
        this.prisma.course.findMany({
          where: { isPublished: true },
          orderBy: { updatedAt: 'desc' },
          take: candidateTake,
          select: {
            id: true,
            title: true,
            updatedAt: true,
            demo: { select: { id: true, name: true } },
          },
        }),
        this.prisma.demoMember.findMany({
          where: { role: DemoMemberRole.OWNER },
          orderBy: { joinedAt: 'desc' },
          take: candidateTake,
          select: {
            id: true,
            joinedAt: true,
            user: { select: { id: true, firstName: true, lastName: true } },
            demo: { select: { id: true, name: true } },
          },
        }),
        this.prisma.demo.findMany({
          select: {
            id: true,
            name: true,
            plan: true,
            members: {
              orderBy: { joinedAt: 'asc' },
              select: { joinedAt: true },
            },
            _count: { select: { members: true } },
          },
        }),
      ]);

    const activities: DashboardActivity[] = [];

    for (const payment of subscriptionPayments) {
      const company = payment.demo;
      if (!company) continue;
      activities.push({
        id: `company-approved:${payment.id}`,
        type: 'COMPANY_APPROVED',
        title: 'Company approved',
        description: `${company.name} activated its subscription.`,
        occurredAt: payment.updatedAt,
        entity: { type: 'COMPANY', id: company.id },
        company,
      });
    }

    for (const course of courses) {
      activities.push({
        id: `course-published:${course.id}`,
        type: 'COURSE_PUBLISHED',
        title: 'Course published',
        description: `${course.title} was published.`,
        occurredAt: course.updatedAt,
        entity: { type: 'COURSE', id: course.id },
        company: course.demo,
      });
    }

    for (const owner of owners) {
      const ownerName = `${owner.user.firstName} ${owner.user.lastName}`.trim();
      activities.push({
        id: `owner-joined:${owner.id}`,
        type: 'NEW_OWNER_JOINED',
        title: 'New owner joined',
        description: `${ownerName} created ${owner.demo.name}.`,
        occurredAt: owner.joinedAt,
        entity: { type: 'USER', id: owner.user.id },
        company: owner.demo,
      });
    }

    for (const company of usageCandidates) {
      const limit = this.membersLimit(company.plan);
      const usagePercentage = Math.round(
        (company._count.members / limit) * 100,
      );
      const thresholdMemberIndex = Math.ceil(limit * 0.9) - 1;
      const thresholdMembership = company.members[thresholdMemberIndex];
      if (usagePercentage < 90 || !thresholdMembership) continue;

      activities.push({
        id: `usage-threshold:${company.id}`,
        type: 'USAGE_THRESHOLD_REACHED',
        title: 'Usage threshold reached',
        description: `${company.name} used ${usagePercentage}% of its seats.`,
        occurredAt: thresholdMembership.joinedAt,
        entity: { type: 'COMPANY', id: company.id },
        company: { id: company.id, name: company.name },
        metadata: {
          usedSeats: company._count.members,
          seatLimit: limit,
          usagePercentage,
        },
      });
    }

    const sortedActivities = activities.sort(
      (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
    );

    return {
      items: sortedActivities.slice(0, take),
      hasMore: sortedActivities.length > take,
    };
  }

  private buildLearnerGrowth(
    memberships: DatedId[],
    period: AnalyticsPeriod,
    now: Date,
  ) {
    const buckets = this.getBuckets(period, now);
    return buckets.map(({ start, end, label }) => ({
      date: start.toISOString(),
      label,
      value: this.uniqueUsersAt(memberships, end),
    }));
  }

  private buildUserDistribution(
    users: { id: string }[],
    members: { userId: string; role: DemoMemberRole }[],
  ) {
    const rolesByUser = new Map<string, Set<DemoMemberRole>>();
    for (const member of members) {
      const roles = rolesByUser.get(member.userId) ?? new Set<DemoMemberRole>();
      roles.add(member.role);
      rolesByUser.set(member.userId, roles);
    }

    const counts = { trainees: 0, managers: 0, owners: 0, otherRoles: 0 };
    for (const user of users) {
      const roles = rolesByUser.get(user.id);
      if (!roles?.size) counts.otherRoles++;
      else if (roles.has(DemoMemberRole.OWNER)) counts.owners++;
      else if (roles.has(DemoMemberRole.ADMIN)) counts.managers++;
      else counts.trainees++;
    }

    const total = users.length;
    return {
      total,
      items: [
        this.distributionItem('TRAINEES', counts.trainees, total),
        this.distributionItem('MANAGERS', counts.managers, total),
        this.distributionItem('OWNERS', counts.owners, total),
        this.distributionItem('OTHER_ROLES', counts.otherRoles, total),
      ],
    };
  }

  private distributionItem(role: string, count: number, total: number) {
    return { role, count, percentage: this.percentage(count, total) };
  }

  private companyStatus(status: SubscriptionStatus, currentPeriodEnd: Date) {
    if (
      status === SubscriptionStatus.ACTIVE ||
      status === SubscriptionStatus.TRIALING
    ) {
      return currentPeriodEnd >= new Date() ? 'ACTIVE' : 'SUSPENDED';
    }
    if (status === SubscriptionStatus.PENDING) return 'PENDING';
    return 'SUSPENDED';
  }

  private membersLimit(plan: PlanTier): number {
    switch (plan) {
      case PlanTier.ENTERPRISE:
        return 100;
      case PlanTier.PRO:
        return 25;
      default:
        return 5;
    }
  }

  private initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  private uniqueUsersAt(rows: DatedId[], date: Date): number {
    return new Set(
      rows.filter((row) => row.joinedAt <= date).map((row) => row.userId),
    ).size;
  }

  private getBuckets(period: AnalyticsPeriod, now: Date) {
    if (period === AnalyticsPeriod.SEVEN_DAYS) {
      return Array.from({ length: 7 }, (_, index) => {
        const start = this.startOfUtcDay(this.addUtcDays(now, index - 6));
        return {
          start,
          end: this.endOfUtcDay(start),
          label: start.toLocaleDateString('en-US', { weekday: 'short' }),
        };
      });
    }

    const months = period === AnalyticsPeriod.ONE_YEAR ? 12 : 6;
    return Array.from({ length: months }, (_, index) => {
      const start = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() - months + index + 1,
          1,
        ),
      );
      const end = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1) - 1,
      );
      return {
        start,
        end,
        label: start.toLocaleDateString('en-US', { month: 'short' }),
      };
    });
  }

  private startOfUtcDay(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  private endOfUtcDay(date: Date): Date {
    return new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1);
  }

  private addUtcDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private growthPercentage(current: number, previous: number): number {
    if (previous === 0) return current === 0 ? 0 : 100;
    return this.round(((current - previous) / previous) * 100);
  }

  private percentage(value: number, total: number): number {
    return total === 0 ? 0 : this.round((value / total) * 100);
  }

  private round(value: number): number {
    return Math.round(value * 10) / 10;
  }
}

type DashboardActivity = {
  id: string;
  type:
    | 'COMPANY_APPROVED'
    | 'COURSE_PUBLISHED'
    | 'NEW_OWNER_JOINED'
    | 'USAGE_THRESHOLD_REACHED';
  title: string;
  description: string;
  occurredAt: Date;
  entity: { type: 'COMPANY' | 'COURSE' | 'USER'; id: string };
  company?: { id: string; name: string };
  metadata?: {
    usedSeats: number;
    seatLimit: number;
    usagePercentage: number;
  };
};
