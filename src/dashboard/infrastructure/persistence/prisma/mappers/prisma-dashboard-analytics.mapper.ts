import { Injectable } from '@nestjs/common';
import {
  DashboardLearnerGrowthView,
  DashboardLearningEngagementView,
  DashboardPlatformHealthView,
  DashboardSummaryView,
  DashboardUserDistributionView,
} from 'src/generated/prisma/client';
import {
  DashboardSummaryCounts,
  LearnerGrowthCount,
  UserDistributionCounts,
} from 'src/dashboard/application/interfaces/dashboard-read-models';
import {
  DashboardPlatformHealthSnapshot,
  LearningEngagementPoint,
} from 'src/dashboard/application/interfaces/dashboard-report-read-models';

@Injectable()
export class PrismaDashboardAnalyticsMapper {
  toSummaryCounts(row: DashboardSummaryView | null): DashboardSummaryCounts {
    if (!row) {
      return {
        registeredCompanies: { current: 0, previous: 0 },
        activeLearners: { current: 0, previous: 0 },
        publishedCourses: { current: 0, previous: 0 },
        completedLearners: { current: 0, previous: 0 },
      };
    }

    return {
      registeredCompanies: {
        current: row.registeredCompaniesCurrent,
        previous: row.registeredCompaniesPrevious,
      },
      activeLearners: {
        current: row.activeLearnersCurrent,
        previous: row.activeLearnersPrevious,
      },
      publishedCourses: {
        current: row.publishedCoursesCurrent,
        previous: row.publishedCoursesPrevious,
      },
      completedLearners: {
        current: row.completedLearnersCurrent,
        previous: row.completedLearnersPrevious,
      },
    };
  }

  toLearnerGrowth(rows: DashboardLearnerGrowthView[]): LearnerGrowthCount[] {
    return rows.map((row) => ({ date: row.date, value: row.value }));
  }

  toUserDistribution(
    rows: DashboardUserDistributionView[],
  ): UserDistributionCounts {
    const countByRole = new Map(rows.map((row) => [row.role, row.count]));

    return {
      total: rows[0]?.total ?? 0,
      trainees: countByRole.get('TRAINEES') ?? 0,
      managers: countByRole.get('MANAGERS') ?? 0,
      owners: countByRole.get('OWNERS') ?? 0,
      otherRoles: countByRole.get('OTHER_ROLES') ?? 0,
    };
  }

  toLearningEngagement(
    rows: DashboardLearningEngagementView[],
  ): LearningEngagementPoint[] {
    return rows.map((row) => ({
      date: row.date,
      activeLearners: row.activeLearners,
      completedLearningPaths: row.completedLearningPaths,
    }));
  }

  toPlatformHealth(
    row: DashboardPlatformHealthView | null,
  ): DashboardPlatformHealthSnapshot {
    if (!row) {
      const now = new Date();
      return {
        periodStart: new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
        ),
        apiAvailability: null,
        courseCompletion: 0,
        workspaceActivation: 0,
        supportResponseSla: 0,
        courseAssignments: 0,
        completedCourseAssignments: 0,
        totalWorkspaces: 0,
        activatedWorkspaces: 0,
        supportInquiries: 0,
        supportResponsesWithinSla: 0,
      };
    }

    return {
      periodStart: row.periodStart,
      apiAvailability: row.apiAvailability,
      courseCompletion: row.courseCompletion,
      workspaceActivation: row.workspaceActivation,
      supportResponseSla: row.supportResponseSla,
      courseAssignments: row.courseAssignments,
      completedCourseAssignments: row.completedCourseAssignments,
      totalWorkspaces: row.totalWorkspaces,
      activatedWorkspaces: row.activatedWorkspaces,
      supportInquiries: row.supportInquiries,
      supportResponsesWithinSla: row.supportResponsesWithinSla,
    };
  }
}
