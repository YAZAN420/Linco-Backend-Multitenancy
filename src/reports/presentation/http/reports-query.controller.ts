import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsQueryService } from 'src/reports/application/reports-query.service';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DemoRoles } from 'src/iam/presentation/http/decorators/demo-roles.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ReportDateRangeQueryDto } from './dto/report-date-range-query.dto';

@ApiTags('Report')
@Controller('reports/demo-owner')
@UseGuards(DemoRolesGuard)
@DemoRoles([DemoMemberRole.OWNER])
export class ReportsQueryController {
  constructor(private readonly service: ReportsQueryService) {}

  @Get()
  async getFullReport(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() query: ReportDateRangeQueryDto,
  ) {
    return {
      message: 'messages.DEMO_OWNER_REPORT_RETRIEVED_SUCCESSFULLY',
      data: await this.service.getFullDemoOwnerReport(demoId, query.toRange()),
    };
  }

  @Get('overview')
  async getOverview(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() query: ReportDateRangeQueryDto,
  ) {
    return {
      message: 'messages.DEMO_OWNER_REPORT_RETRIEVED_SUCCESSFULLY',
      data: await this.service.getDemoOwnerReport(demoId, query.toRange()),
    };
  }

  @Get('members')
  async getMemberPerformance(@ActiveDemoMember('demoId') demoId: string) {
    return {
      message: 'messages.MEMBER_PERFORMANCE_REPORT_RETRIEVED_SUCCESSFULLY',
      data: await this.service.getMemberPerformance(demoId),
    };
  }

  @Get('courses')
  async getCoursePerformance(@ActiveDemoMember('demoId') demoId: string) {
    return {
      message: 'messages.COURSE_PERFORMANCE_REPORT_RETRIEVED_SUCCESSFULLY',
      data: await this.service.getCoursePerformance(demoId),
    };
  }

  @Get('departments')
  async getDepartmentPerformance(@ActiveDemoMember('demoId') demoId: string) {
    return {
      message: 'messages.DEPARTMENT_PERFORMANCE_REPORT_RETRIEVED_SUCCESSFULLY',
      data: await this.service.getDepartmentPerformance(demoId),
    };
  }
}
