import { Controller, Get, Param, Query } from '@nestjs/common';

import { CoursesQueryService } from 'src/courses/application/courses-query.service';

import { CourseResponseMapper } from './mappers/course-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { CoursesCursorQueryDto } from './dto/queries/course-cursor-query.dto';
import { CoursesQueryDto } from './dto/queries/course-query.dto';

import { Roles } from 'src/iam/presentation/http/decorators/roles.decorator';
import { Role } from 'src/users/domain/enums/role.enum';

@ApiTags('Course')
@Controller('courses')
export class CoursesQueryController {
  constructor(
    private readonly courseQueryService: CoursesQueryService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Roles([Role.ADMIN])
  @Get('stats')
  async getDashboardStats() {
    const stats = await this.courseQueryService.getDashboardStats();

    return {
      message: 'messages.COURSE_STATS_FETCHED_SUCCESSFULLY',
      data: this.courseResponseMapper.toDashboardStatsResponse(stats),
    };
  }

  @Roles([Role.ADMIN])
  @Get()
  async findAll(@Query() options: CoursesQueryDto) {
    const courses = await this.courseQueryService.findAll(options);

    return {
      message: 'messages.COURSES_FETCHED_SUCCESSFULLY',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: CoursesCursorQueryDto) {
    const courses = await this.courseQueryService.findAllCursor(options);

    return {
      message: 'messages.COURSES_FETCHED_SUCCESSFULLY',
      data: this.courseResponseMapper.toResponseManyFromPrisma(courses.data),
      meta: courses.meta,
    };
  }

  @Get(':courseId')
  async findOne(@Param('courseId') courseId: string) {
    const course = await this.courseQueryService.findById(courseId);

    return {
      message: 'messages.COURSE_RETRIEVED_SUCCESSFULLY',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }
}
