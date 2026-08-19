import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardQueryService } from 'src/dashboard/application/dashboard-query.service';
import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';
import { DashboardAnalyticsQueryDto } from './dto/dashboard-analytics-query.dto';
import { DashboardResponseMapper } from './mappers/dashboard-response.mapper';

@ApiTags('Dashboard')
@Roles([Role.ADMIN])
@Controller('dashboard')
export class DashboardQueryController {
  constructor(
    private readonly queryService: DashboardQueryService,
    private readonly responseMapper: DashboardResponseMapper,
  ) {}

  @Get('analytics')
  async getAnalytics(@Query() query: DashboardAnalyticsQueryDto) {
    const analytics = await this.queryService.getAnalytics(query.period);

    return {
      message: 'messages.REQUEST_SUCCESSFUL',
      data: this.responseMapper.toAnalyticsResponse(analytics),
    };
  }

  @Get('reports')
  async getReports() {
    const reports = await this.queryService.getReports();

    return {
      message: 'messages.REQUEST_SUCCESSFUL',
      data: this.responseMapper.toReportsResponse(reports),
    };
  }
}
