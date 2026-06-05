import { Controller, Get, Param, Query } from '@nestjs/common';
import { DepartmentsQueryService } from 'src/demos/application/departments-query.service';
import { DepartmentResponseMapper } from './mappers/department-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';

@Controller('demos/:demoId/departments')
export class DepartmentsQueryController {
  constructor(
    private readonly departmentsQueryService: DepartmentsQueryService,
    private readonly departmentResponseMapper: DepartmentResponseMapper,
  ) {}

  @Get()
  async findDepartments(
    @Param('demoId') demoId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departments = await this.departmentsQueryService.findDepartments(
      options,
      demoId,
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
  ) {
    const department = await this.departmentsQueryService.findDepartmentById(
      demoId,
      deptId,
    );

    return {
      message: 'Department retrieved successfully',
      data: this.departmentResponseMapper.toResponseFromPrisma(department),
    };
  }
}
