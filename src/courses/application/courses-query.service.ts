import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from './interfaces/find-courses.query';

import { CourseQueryRepository } from './ports/course-query.repository';
import { CourseWithStats } from 'src/core/database/prisma/types';
import { CourseDashboardStats } from './interfaces/course-dashboard-stats.interface';

@Injectable()
export class CoursesQueryService {
  constructor(private readonly courseQueryRepository: CourseQueryRepository) {}

  async findAll(
    pageOptionsDto: FindCoursesQuery,
  ): Promise<PageDto<CourseWithStats>> {
    return this.courseQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<CourseWithStats>> {
    return this.courseQueryRepository.findAllCursor(options);
  }

  async findById(
    courseId: string,
    checkVisibility = true,
  ): Promise<CourseWithStats> {
    const course = await this.courseQueryRepository.findById(
      courseId,
      checkVisibility,
    );
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');
    return course;
  }

  async getDashboardStats(): Promise<CourseDashboardStats> {
    return this.courseQueryRepository.getDashboardStats();
  }
}
