import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindCourseFaqsCursorQuery } from './interfaces/find-courseFaqs.query';
import { CourseFaq } from 'src/generated/prisma/client';
import { CourseFaqQueryRepository } from './ports/courseFaq-query.repository';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';

@Injectable()
export class CourseFaqsQueryService {
  constructor(
    private readonly courseCommandRepository: CourseCommandRepository,
    private readonly courseFaqQueryRepository: CourseFaqQueryRepository,
  ) {}

  async findAllCursor(
    courseId: string,
    options: FindCourseFaqsCursorQuery,
  ): Promise<CursorPageDto<CourseFaq>> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course Not Found');

    return this.courseFaqQueryRepository.findAllCursor(courseId, options);
  }

  async findById(courseId: string, id: string): Promise<CourseFaq> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course Not Found');

    const courseFaq = await this.courseFaqQueryRepository.findById(id);
    if (!courseFaq) throw new NotFoundException('CourseFaq not found');
    return courseFaq;
  }
}
