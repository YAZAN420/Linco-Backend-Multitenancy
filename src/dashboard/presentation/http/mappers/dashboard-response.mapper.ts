import { Injectable } from '@nestjs/common';
import {
  DashboardActivity,
  DashboardAnalytics,
  RecentCompany,
} from 'src/dashboard/application/interfaces/dashboard-read-models';
import {
  DashboardActivityResponseDto,
  DashboardAnalyticsResponseDto,
  RecentCompanyResponseDto,
} from '../dto/dashboard-response.dto';

@Injectable()
export class DashboardResponseMapper {
  toAnalyticsResponse(
    analytics: DashboardAnalytics,
  ): DashboardAnalyticsResponseDto {
    return new DashboardAnalyticsResponseDto(
      analytics.summary,
      analytics.activeLearnerGrowth,
      analytics.userDistribution,
    );
  }

  toRecentCompanyResponse(company: RecentCompany): RecentCompanyResponseDto {
    return new RecentCompanyResponseDto(
      company.id,
      company.name,
      company.initials,
      company.imagePath,
      company.plan,
      company.membersCount,
      company.status,
      company.subscriptionStatus,
      company.currentPeriodEnd,
      company.joinedAt,
      { id: company.owner.id, name: company.ownerName },
    );
  }

  toRecentCompaniesResponse(
    companies: RecentCompany[],
  ): RecentCompanyResponseDto[] {
    return companies.map((company) => this.toRecentCompanyResponse(company));
  }

  toActivityResponse(
    activity: DashboardActivity,
  ): DashboardActivityResponseDto {
    return new DashboardActivityResponseDto(
      activity.id,
      activity.type,
      activity.title,
      activity.description,
      activity.occurredAt,
      activity.entity,
      activity.company,
      activity.metadata,
    );
  }

  toActivitiesResponse(
    activities: DashboardActivity[],
  ): DashboardActivityResponseDto[] {
    return activities.map((activity) => this.toActivityResponse(activity));
  }
}
