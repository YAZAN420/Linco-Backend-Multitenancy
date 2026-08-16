import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { DepartmentResponseMapper } from '../mappers/department-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';
import { DepartmentsQueryService } from 'src/demos/application/department/departments-query.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';

@ApiTags('Department')
@UseGuards(DemoRolesGuard)
@Controller('departments')
export class DepartmentsQueryController {
  constructor(
    private readonly departmentsQueryService: DepartmentsQueryService,
    private readonly departmentResponseMapper: DepartmentResponseMapper,
  ) {}

  @Get()
  async findDepartments(
    @ActiveDemoMember('demoId') demoId: string,
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departments = await this.departmentsQueryService.findDepartments(
      options,
      demoId,
      user.id,
    );

    return {
      message: 'messages.DEPARTMENTS_FETCHED_SUCCESSFULLY',
      data: this.departmentResponseMapper.toResponseManyFromPrisma(
        departments.data,
      ),
      meta: departments.meta,
    };
  }

  @Get('leaderboard')
  @UseGuards(DepartmentRolesGuard)
  async getLeaderboard(
    @ActiveDepartmentMember('departmentId') deptId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const leaderboard =
      await this.departmentsQueryService.getDepartmentLeaderboard(
        deptId,
        options,
      );

    return {
      message: 'messages.DEPARTMENT_LEADERBOARD_FETCHED_SUCCESSFULLY',
      data: this.departmentResponseMapper.toLeaderboardResponseMany(
        leaderboard.data,
      ),
      meta: leaderboard.meta,
    };
  }

  @Get(':deptId')
  @UseGuards(DepartmentRolesGuard)
  async findDepartment(
    @ActiveDemoMember('id') demoMemberId: string,
    @Param('deptId') deptId: string,
  ) {
    const department = await this.departmentsQueryService.findDepartmentById(
      deptId,
      demoMemberId,
    );

    return {
      message: 'messages.DEPARTMENT_RETRIEVED_SUCCESSFULLY',
      data: this.departmentResponseMapper.toResponseFromPrisma(department),
    };
  }
}
