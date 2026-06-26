import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from './interfaces/find-courses.query';

import { CourseQueryRepository } from './ports/course-query.repository';
import { CourseWithDemo } from 'src/core/database/prisma/types';

@Injectable()
export class CoursesQueryService {
  constructor(private readonly courseQueryRepository: CourseQueryRepository) {}

  async findAll(
    pageOptionsDto: FindCoursesQuery,
  ): Promise<PageDto<CourseWithDemo>> {
    return this.courseQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<CourseWithDemo>> {
    return this.courseQueryRepository.findAllCursor(options);
  }

  async findById(courseId: string): Promise<CourseWithDemo> {
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
