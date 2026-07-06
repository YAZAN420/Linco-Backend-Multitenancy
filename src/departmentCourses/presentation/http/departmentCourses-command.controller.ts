import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateDepartmentCourseDto } from './dto/create-departmentCourse.dto';

import { DepartmentCourseResponseMapper } from './mappers/departmentCourse-response.mapper';
import { DepartmentCoursesCommandService } from 'src/departmentCourses/application/departmentCourses-command.service';
import { DepartmentCoursesQueryService } from 'src/departmentCourses/application/departmentCourses-query.service';

@Controller('department/:departmentId/departmentCourses')
export class DepartmentCoursesCommandController {
  constructor(
    private readonly departmentCourseCommandService: DepartmentCoursesCommandService,
    private readonly departmentCourseQueryService: DepartmentCoursesQueryService,
    private readonly departmentCourseResponseMapper: DepartmentCourseResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('departmentId') departmentId: string,
    @Body() dto: CreateDepartmentCourseDto,
  ) {
    const createdDepartmentCourse =
      await this.departmentCourseCommandService.create(departmentId, dto);
    const departmentCourse = await this.departmentCourseQueryService.findById(
      departmentId,
      createdDepartmentCourse.id,
    );
    return {
      message: 'DepartmentCourse created successfully',
      data: this.departmentCourseResponseMapper.toResponseFromPrisma(
        departmentCourse,
      ),
    };
  }

  @Delete(':departmentCourseId')
  async remove(
    @Param('departmentId') departmentId: string,
    @Param('departmentCourseId') departmentCourseId: string,
  ) {
    await this.departmentCourseCommandService.remove(
      departmentId,
      departmentCourseId,
    );

    return {
      message: 'DepartmentCourse deleted successfully',
      data: null,
    };
  }
}
