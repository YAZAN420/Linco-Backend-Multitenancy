import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardAnalyticsService } from 'src/dashboard/application/dashboard-analytics.service';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';
import { DashboardAnalyticsQueryDto } from './dto/dashboard-analytics-query.dto';
import { RecentDashboardQueryDto } from './dto/recent-dashboard-query.dto';

@ApiTags('Dashboard')
@Roles([Role.ADMIN])
@Controller('dashboard')
export class DashboardAnalyticsController {
  constructor(private readonly analyticsService: DashboardAnalyticsService) {}

  @Get('analytics')
  async getAnalytics(@Query() query: DashboardAnalyticsQueryDto) {
    return {
      message: 'messages.REQUEST_SUCCESSFUL',
      data: await this.analyticsService.getAnalytics(query.period),
    };
  }

  @Get('recent-companies')
  async getRecentlyJoinedCompanies(@Query() query: RecentDashboardQueryDto) {
    return {
      message: 'messages.REQUEST_SUCCESSFUL',
      data: await this.analyticsService.getRecentlyJoinedCompanies(query.take),
    };
  }

  @Get('recent-activity')
  async getRecentActivity(@Query() query: RecentDashboardQueryDto) {
    return {
      message: 'messages.REQUEST_SUCCESSFUL',
      data: await this.analyticsService.getRecentActivity(query.take),
    };
  }
}
