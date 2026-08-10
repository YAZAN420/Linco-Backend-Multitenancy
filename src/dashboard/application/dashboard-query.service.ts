import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';
import { AnalyticsPeriod } from './interfaces/dashboard-analytics.query';
import {
  DashboardAnalytics,
  DashboardActivity,
  DashboardActivityReadModel,
  RecentCompany,
  RecentCompanyReadModel,
  UserDistributionCounts,
} from './interfaces/dashboard-read-models';
import { FindDashboardPageQuery } from './interfaces/find-dashboard.query';
import { DashboardQueryRepository } from './ports/dashboard-query.repository';

@Injectable()
export class DashboardQueryService {
  constructor(private readonly repository: DashboardQueryRepository) {}

  async getAnalytics(period: AnalyticsPeriod): Promise<DashboardAnalytics> {
    const now = new Date();
    const comparisonAt = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [counts, growth, distribution] = await Promise.all([
      this.repository.getSummaryCounts(comparisonAt),
      this.repository.getLearnerGrowth(period, now),
      this.repository.getUserDistribution(),
    ]);

    const completionRate = this.percentage(
      counts.completedLearners.current,
      counts.activeLearners.current,
    );
    const previousCompletionRate = this.percentage(
      counts.completedLearners.previous,
      counts.activeLearners.previous,
    );

    return {
      summary: {
        registeredCompanies: this.metric(counts.registeredCompanies),
        activeLearners: this.metric(counts.activeLearners),
        publishedCourses: this.metric(counts.publishedCourses),
        completionRate: {
          value: completionRate,
          changePercentage: this.round(completionRate - previousCompletionRate),
        },
      },
      activeLearnerGrowth: {
        period,
        total: counts.activeLearners.current,
        changePercentage: this.growthPercentage(
          counts.activeLearners.current,
          counts.activeLearners.previous,
        ),
        points: growth.map((point) => ({
          ...point,
          label: this.growthLabel(point.date, period),
        })),
      },
      userDistribution: this.mapDistribution(distribution),
    };
  }

  async findRecentlyJoinedCompanies(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<RecentCompany>> {
    const page = await this.repository.findRecentlyJoinedCompanies(options);
    return new PageDto(
      page.data.map((company) => this.mapCompany(company)),
      page.meta,
    );
  }

  async findRecentActivity(
    options: FindDashboardPageQuery,
  ): Promise<PageDto<DashboardActivity>> {
    const page = await this.repository.findRecentActivity(options);
    return new PageDto(
      page.data.map((activity) => this.mapActivity(activity)),
      page.meta,
    );
  }

  private mapActivity(activity: DashboardActivityReadModel): DashboardActivity {
    const common = {
      id: activity.id,
      type: activity.type,
      occurredAt: activity.occurredAt,
      entity: activity.entity,
      company: activity.company,
      metadata: activity.metadata,
    };

    switch (activity.type) {
      case 'COMPANY_APPROVED':
        return {
          ...common,
          title: 'Company approved',
          description: `${activity.subjectName} activated its subscription.`,
        };
      case 'COURSE_PUBLISHED':
        return {
          ...common,
          title: 'Course published',
          description: `${activity.subjectName} was published.`,
        };
      case 'NEW_OWNER_JOINED':
        return {
          ...common,
          title: 'New owner joined',
          description: `${activity.subjectName} created ${activity.company?.name ?? 'a workspace'}.`,
        };
      case 'USAGE_THRESHOLD_REACHED':
        return {
          ...common,
          title: 'Usage threshold reached',
          description: `${activity.subjectName} used ${activity.metadata?.usagePercentage ?? 0}% of its seats.`,
        };
    }
  }

  private metric(comparison: { current: number; previous: number }) {
    return {
      value: comparison.current,
      changePercentage: this.growthPercentage(
        comparison.current,
        comparison.previous,
      ),
    };
  }

  private mapCompany(company: RecentCompanyReadModel): RecentCompany {
    return {
      ...company,
      initials: company.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase(),
      status: this.companyStatus(
        company.subscriptionStatus,
        company.currentPeriodEnd,
      ),
      joinedAt: company.createdAt,
      ownerName: `${company.owner.firstName} ${company.owner.lastName}`.trim(),
    };
  }

  private companyStatus(
    status: SubscriptionStatus,
    currentPeriodEnd: Date,
  ): 'ACTIVE' | 'PENDING' | 'SUSPENDED' {
    if (status === SubscriptionStatus.PENDING) return 'PENDING';
    if (
      (status === SubscriptionStatus.ACTIVE ||
        status === SubscriptionStatus.TRIALING) &&
      currentPeriodEnd >= new Date()
    ) {
      return 'ACTIVE';
    }
    return 'SUSPENDED';
  }

  private mapDistribution(counts: UserDistributionCounts) {
    return {
      total: counts.total,
      items: [
        this.distributionItem('TRAINEES', counts.trainees, counts.total),
        this.distributionItem('MANAGERS', counts.managers, counts.total),
        this.distributionItem('OWNERS', counts.owners, counts.total),
        this.distributionItem('OTHER_ROLES', counts.otherRoles, counts.total),
      ],
    };
  }

  private distributionItem(
    role: 'TRAINEES' | 'MANAGERS' | 'OWNERS' | 'OTHER_ROLES',
    count: number,
    total: number,
  ) {
    return { role, count, percentage: this.percentage(count, total) };
  }

  private growthLabel(date: Date, period: AnalyticsPeriod): string {
    return date.toLocaleDateString('en-US', {
      [period === AnalyticsPeriod.SEVEN_DAYS ? 'weekday' : 'month']: 'short',
      timeZone: 'UTC',
    });
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
