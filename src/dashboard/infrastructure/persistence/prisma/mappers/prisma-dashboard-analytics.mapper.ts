import { Injectable } from '@nestjs/common';
import {
  DashboardLearnerGrowthView,
  DashboardSummaryView,
  DashboardUserDistributionView,
} from 'src/generated/prisma/client';
import {
  DashboardSummaryCounts,
  LearnerGrowthCount,
  UserDistributionCounts,
} from 'src/dashboard/application/interfaces/dashboard-read-models';

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
}
