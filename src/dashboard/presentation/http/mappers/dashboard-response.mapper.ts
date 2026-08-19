import { Injectable } from '@nestjs/common';
import { DashboardAnalytics } from 'src/dashboard/application/interfaces/dashboard-read-models';
import { DashboardAnalyticsResponseDto } from '../dto/dashboard-analytics-response.dto';

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
}
