import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';
import { CourseQueryRepository } from './ports/course-query.repository';

@Injectable()
export class SectionsQueryService {
  constructor(private readonly courseQueryRepository: CourseQueryRepository) {}

  async findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    return this.courseQueryRepository.findSectionsCursor(courseId, options);
  }

  async findById(courseId: string, sectionId: string): Promise<Section> {
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = await this.courseQueryRepository.findSectionById(sectionId);
    if (!section)
      throw new NotFoundException('Section not found in this course');
    return section;
  }
}
