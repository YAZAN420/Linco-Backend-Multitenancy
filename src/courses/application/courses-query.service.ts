import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from './interfaces/find-courses.query';
import { Course } from 'src/generated/prisma/client';
import { CourseQueryRepository } from './ports/course-query.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';

@Injectable()
export class CoursesQueryService {
  constructor(
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAll(
    demoId: string,
    pageOptionsDto: FindCoursesQuery,
  ): Promise<PageDto<Course>> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    return this.courseQueryRepository.findAll(demoId, pageOptionsDto);
  }

  async findAllCursor(
    demoId: string,
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<Course>> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    return this.courseQueryRepository.findAllCursor(demoId, options);
  }

  async findById(demoId: string, courseId: string): Promise<Course> {
    const demo = await this.demoQueryRepository.demoExists(demoId);
    if (!demo) {
      throw new NotFoundException('Demo not found');
    }
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
