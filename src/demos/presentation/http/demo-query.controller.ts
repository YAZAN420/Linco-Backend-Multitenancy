import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindDemosCursorDto } from './dto/filters/find-demos-cursor.dto';

import { DemosQueryService } from 'src/demos/application/demos-query.service';

import { DemoResponseMapper } from './mappers/demo-response.mapper';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { DepartmentResponseMapper } from './mappers/department-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';

@Controller('demos')
export class DemosQueryController {
  constructor(
    private readonly demoQueryService: DemosQueryService,
    private readonly demoResponseMapper: DemoResponseMapper,
    private readonly departmentResponseMapper: DepartmentResponseMapper,
  ) {}

  @Get()
  async findAllForMe(
    @ActiveUser() user: ActiveUserData,
    @Query() options: FindDemosCursorDto,
  ) {
    const demos = await this.demoQueryService.findAllForMe(options, user.id);

    return {
      message: 'Demos fetched successfully ',
      data: this.demoResponseMapper.toResponseManyFromPrisma(demos.data),
      meta: demos.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const demo = await this.demoQueryService.findById(id);
    return {
      message: 'Demo retrieved successfully',
      data: this.demoResponseMapper.toResponseFromPrisma(demo),
    };
  }

  @Get(':id/departments')
  async findDepartments(
    @Query() options: CursorPageOptionsDto,
    @Param('id') id: string,
  ) {
    const departments = await this.demoQueryService.findDepartments(
      options,
      id,
    );

    return {
      message: 'Departments fetched successfully',
      data: this.departmentResponseMapper.toResponseManyFromPrisma(
        departments.data,
      ),
      meta: departments.meta,
    };
  }

  @Get(':id/departments/:deptId')
  async findDepartment(
    @Param('id') id: string,
    @Param('deptId') deptId: string,
  ) {
    const department = await this.demoQueryService.findDepartmentById(
      id,
      deptId,
    );

    return {
      message: 'Department retrieved successfully',
      data: this.departmentResponseMapper.toResponseFromPrisma(department),
    };
  }
}
