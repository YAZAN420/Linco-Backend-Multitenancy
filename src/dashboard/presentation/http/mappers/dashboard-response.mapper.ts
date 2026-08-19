import { Injectable } from '@nestjs/common';
import { DashboardAnalytics } from 'src/dashboard/application/interfaces/dashboard-read-models';
import { DashboardAnalyticsResponseDto } from '../dto/dashboard-analytics-response.dto';
import { DashboardReports } from 'src/dashboard/application/interfaces/dashboard-report-read-models';
import { DashboardReportsResponseDto } from '../dto/dashboard-reports-response.dto';

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

  toReportsResponse(reports: DashboardReports): DashboardReportsResponseDto {
    return new DashboardReportsResponseDto(
      reports.learningEngagement,
      reports.platformHealth,
      reports.reportCatalog,
    );
  }
}
