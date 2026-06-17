import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindDepartmentCoursesDto } from './dto/filters/find-departmentCourses.dto';
import { FindDepartmentCoursesCursorDto } from './dto/filters/find-departmentCourses-cursor.dto';

import { DepartmentCoursesQueryService } from 'src/departmentCourses/application/departmentCourses-query.service';

import { DepartmentCourseResponseMapper } from './mappers/departmentCourse-response.mapper';

@Controller('departmentCourses')
export class DepartmentCoursesQueryController {
  constructor(
    private readonly departmentCourseQueryService: DepartmentCoursesQueryService,
    private readonly departmentCourseResponseMapper: DepartmentCourseResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: FindDepartmentCoursesDto) {
    const departmentCourses =
      await this.departmentCourseQueryService.findAll(options);
    return {
      message: 'DepartmentCourses fetched successfully',
      data: this.departmentCourseResponseMapper.toResponseManyFromPrisma(
        departmentCourses.data,
      ),
      meta: departmentCourses.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindDepartmentCoursesCursorDto) {
    const departmentCourses =
      await this.departmentCourseQueryService.findAllCursor(options);

    return {
      message: 'DepartmentCourses fetched successfully (Cursor)',
      data: this.departmentCourseResponseMapper.toResponseManyFromPrisma(
        departmentCourses.data,
      ),
      meta: departmentCourses.meta,
    };
  }

  @Get(':departmentCourseId')
  async findOne(@Param('departmentCourseId') departmentCourseId: string) {
    const departmentCourse =
      await this.departmentCourseQueryService.findById(departmentCourseId);

    return {
      message: 'DepartmentCourse retrieved successfully',
      data: this.departmentCourseResponseMapper.toResponseFromPrisma(
        departmentCourse,
      ),
    };
  }
}
