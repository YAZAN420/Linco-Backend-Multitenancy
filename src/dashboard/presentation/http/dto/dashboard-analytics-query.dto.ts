import { IsEnum, IsOptional } from 'class-validator';
import { AnalyticsPeriod } from 'src/dashboard/application/interfaces/dashboard-analytics.query';

export class DashboardAnalyticsQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  readonly period: AnalyticsPeriod = AnalyticsPeriod.SIX_MONTHS;
}
