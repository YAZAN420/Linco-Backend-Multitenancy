import { Controller, Get, Param, Query } from '@nestjs/common';

import { DepartmentResponseMapper } from '../mappers/department-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';
import { DepartmentsQueryService } from 'src/demos/application/department/departments-query.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Department')
@Controller('demos/:demoId/departments')
export class DepartmentsQueryController {
  constructor(
    private readonly departmentsQueryService: DepartmentsQueryService,
    private readonly departmentResponseMapper: DepartmentResponseMapper,
  ) {}

  @Get()
  async findDepartments(
    @Param('demoId') demoId: string,
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departments = await this.departmentsQueryService.findDepartments(
      options,
      demoId,
      user.id,
    );

    return {
      message: 'Departments fetched successfully',
      data: this.departmentResponseMapper.toResponseManyFromPrisma(
        departments.data,
      ),
      meta: departments.meta,
    };
  }

  @Get(':deptId')
  async findDepartment(
    @Param('demoId') demoId: string,
    @Param('deptId') deptId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    const department = await this.departmentsQueryService.findDepartmentById(
      demoId,
      deptId,
      user.id,
    );

    return {
      message: 'Department retrieved successfully',
      data: this.departmentResponseMapper.toResponseFromPrisma(department),
    };
  }
}
