import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateDepartmentCourseDto } from './dto/create-departmentCourse.dto';

import { DepartmentCourseResponseMapper } from './mappers/departmentCourse-response.mapper';
import { DepartmentCoursesCommandService } from 'src/departmentCourses/application/departmentCourses-command.service';

@Controller('department/:departmentId/departmentCourses')
export class DepartmentCoursesCommandController {
  constructor(
    private readonly departmentCourseCommandService: DepartmentCoursesCommandService,
    private readonly departmentCourseResponseMapper: DepartmentCourseResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('departmentId') departmentId: string,
    @Body() dto: CreateDepartmentCourseDto,
  ) {
    const departmentCourse = await this.departmentCourseCommandService.create(
      departmentId,
      dto,
    );

    return {
      message: 'DepartmentCourse created successfully',
      data: this.departmentCourseResponseMapper.toResponseFromDomain(
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
