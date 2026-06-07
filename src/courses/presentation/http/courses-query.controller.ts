import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindCoursesDto } from './dto/filters/find-courses.dto';
import { FindCoursesCursorDto } from './dto/filters/find-courses-cursor.dto';

import { CoursesQueryService } from 'src/courses/application/courses-query.service';

import { CourseResponseMapper } from './mappers/course-response.mapper';

@Controller('courses')
export class CoursesQueryController {
  constructor(
    private readonly courseQueryService: CoursesQueryService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: FindCoursesDto) {
    const courses = await this.courseQueryService.findAll(options);
    return {
      message: 'Courses fetched successfully',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindCoursesCursorDto) {
    const courses = await this.courseQueryService.findAllCursor(options);

    return {
      message: 'Courses fetched successfully (Cursor)',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courseQueryService.findById(id);

    return {
      message: 'Course retrieved successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }
}
