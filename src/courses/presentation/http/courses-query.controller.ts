import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { CoursesQueryService } from 'src/courses/application/courses-query.service';

import { CourseResponseMapper } from './mappers/course-response.mapper';

@Controller('courses')
export class CoursesQueryController {
  constructor(
    private readonly courseQueryService: CoursesQueryService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: PageOptionsDto) {
    const courses = await this.courseQueryService.findAll(options);

    return {
      message: 'Courses fetched successfully',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: CursorPageOptionsDto) {
    const courses = await this.courseQueryService.findAllCursor(options);

    return {
      message: 'Courses fetched successfully ',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get(':courseId')
  async findOne(@Param('courseId') courseId: string) {
    const course = await this.courseQueryService.findById(courseId);

    return {
      message: 'Course retrieved successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }
}
