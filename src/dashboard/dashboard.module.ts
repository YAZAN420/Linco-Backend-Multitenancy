import { Module } from '@nestjs/common';
import { DashboardAnalyticsService } from './application/dashboard-analytics.service';
import { DashboardAnalyticsController } from './presentation/http/dashboard-analytics.controller';

@Module({
  controllers: [DashboardAnalyticsController],
  providers: [DashboardAnalyticsService],
})
export class DashboardModule {}
