import { Injectable } from '@nestjs/common';
import { AnalyticsPeriod } from './interfaces/dashboard-analytics.query';
import {
  CountComparison,
  DashboardAnalytics,
  UserDistributionCounts,
  UserDistributionRole,
} from './interfaces/dashboard-read-models';
import { DashboardQueryRepository } from './ports/dashboard-query.repository';
import {
  DashboardReportKey,
  DashboardReports,
} from './interfaces/dashboard-report-read-models';

@Injectable()
export class DashboardQueryService {
  constructor(private readonly repository: DashboardQueryRepository) {}

  async getAnalytics(period: AnalyticsPeriod): Promise<DashboardAnalytics> {
    const [counts, growth, distribution] = await Promise.all([
      this.repository.getSummaryCounts(),
      this.repository.getLearnerGrowth(period),
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
        registeredCompanies: this.toMetric(counts.registeredCompanies),
        activeLearners: this.toMetric(counts.activeLearners),
        publishedCourses: this.toMetric(counts.publishedCourses),
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
      userDistribution: this.toUserDistribution(distribution),
    };
  }

  async getReports(): Promise<DashboardReports> {
    const [learningEngagement, platformHealth] = await Promise.all([
      this.repository.getLearningEngagement(),
      this.repository.getPlatformHealth(),
    ]);

    return {
      learningEngagement: {
        period: 'LAST_SIX_MONTHS',
        points: learningEngagement.map((point) => ({
          ...point,
          label: point.date.toLocaleDateString('en-US', {
            month: 'short',
            timeZone: 'UTC',
          }),
        })),
      },
      platformHealth: {
        period: 'CURRENT_MONTH',
        periodStart: platformHealth.periodStart,
        apiAvailability: {
          value: platformHealth.apiAvailability,
          measured: platformHealth.apiAvailability !== null,
        },
        courseCompletion: {
          value: platformHealth.courseCompletion,
          completedAssignments: platformHealth.completedCourseAssignments,
          totalAssignments: platformHealth.courseAssignments,
        },
        workspaceActivation: {
          value: platformHealth.workspaceActivation,
          activatedWorkspaces: platformHealth.activatedWorkspaces,
          totalWorkspaces: platformHealth.totalWorkspaces,
        },
        supportResponseSla: {
          value: platformHealth.supportResponseSla,
          responsesWithinSla: platformHealth.supportResponsesWithinSla,
          totalInquiries: platformHealth.supportInquiries,
          targetHours: 24,
        },
      },
      reportCatalog: this.reportCatalog(),
    };
  }

  private reportCatalog(): DashboardReports['reportCatalog'] {
    const reports: Array<{
      key: DashboardReportKey;
      title: string;
      description: string;
    }> = [
      {
        key: 'COMPANY_ADOPTION',
        title: 'Company adoption',
        description:
          'Workspace growth, plan distribution, and company engagement.',
      },
      {
        key: 'LEARNER_PERFORMANCE',
        title: 'Learner performance',
        description:
          'Completion rates, activity levels, scores, and certificate progress.',
      },
      {
        key: 'CONTENT_PERFORMANCE',
        title: 'Content performance',
        description:
          'Enrollment, completion, drop-off, and curriculum quality insights.',
      },
    ];

    return reports;
  }

  private toMetric(comparison: CountComparison) {
    return {
      value: comparison.current,
      changePercentage: this.growthPercentage(
        comparison.current,
        comparison.previous,
      ),
    };
  }

  private toUserDistribution(counts: UserDistributionCounts) {
    return {
      total: counts.total,
      items: [
        this.toDistributionItem('TRAINEES', counts.trainees, counts.total),
        this.toDistributionItem('MANAGERS', counts.managers, counts.total),
        this.toDistributionItem('OWNERS', counts.owners, counts.total),
        this.toDistributionItem('OTHER_ROLES', counts.otherRoles, counts.total),
      ],
    };
  }

  private toDistributionItem(
    role: UserDistributionRole,
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
