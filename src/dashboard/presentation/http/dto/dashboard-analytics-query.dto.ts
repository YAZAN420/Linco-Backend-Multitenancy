import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsPeriod {
  SEVEN_DAYS = '7D',
  SIX_MONTHS = '6M',
  ONE_YEAR = '1Y',
}

export class DashboardAnalyticsQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period: AnalyticsPeriod = AnalyticsPeriod.SIX_MONTHS;
}
