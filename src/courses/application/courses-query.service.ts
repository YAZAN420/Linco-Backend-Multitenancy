import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from './interfaces/find-courses.query';
import { Course } from 'src/generated/prisma/client';
import { CourseQueryRepository } from './ports/course-query.repository';

@Injectable()
export class CoursesQueryService {
  constructor(private readonly courseQueryRepository: CourseQueryRepository) {}

  async findAll(pageOptionsDto: FindCoursesQuery): Promise<PageDto<Course>> {
    return this.courseQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<Course>> {
    return this.courseQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseQueryRepository.findById(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
