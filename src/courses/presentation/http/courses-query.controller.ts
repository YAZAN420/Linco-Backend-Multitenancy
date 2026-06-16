import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindCoursesDto } from './dto/filters/find-courses.dto';
import { FindCoursesCursorDto } from './dto/filters/find-courses-cursor.dto';

import { CoursesQueryService } from 'src/courses/application/courses-query.service';

import { CourseResponseMapper } from './mappers/course-response.mapper';

@Controller('demos/:demoId/courses')
export class CoursesQueryController {
  constructor(
    private readonly courseQueryService: CoursesQueryService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('demoId') demoId: string,
    @Query() options: FindCoursesDto,
  ) {
    const courses = await this.courseQueryService.findAll(demoId, options);
    return {
      message: 'Courses fetched successfully',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Param('demoId') demoId: string,
    @Query() options: FindCoursesCursorDto,
  ) {
    const courses = await this.courseQueryService.findAllCursor(
      demoId,
      options,
    );

    return {
      message: 'Courses fetched successfully (Cursor)',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get(':courseId')
  async findOne(
    @Param('demoId') demoId: string,
    @Param('courseId') courseId: string,
  ) {
    const course = await this.courseQueryService.findById(demoId, courseId);

    return {
      message: 'Course retrieved successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }
}
