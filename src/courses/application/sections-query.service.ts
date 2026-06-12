import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { SectionQueryRepository } from './ports/section-query.repository';
import { Section } from 'src/generated/prisma/client';
import { CourseQueryRepository } from './ports/course-query.repository';

@Injectable()
export class SectionsQueryService {
  constructor(
    private readonly sectionQueryRepository: SectionQueryRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
  ) {}

  async findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    return this.sectionQueryRepository.findAllCursor(courseId, options);
  }

  async findById(sectionId: string): Promise<Section> {
    const section = await this.sectionQueryRepository.findById(sectionId);
    if (!section)
      throw new NotFoundException('Section not found in this course');
    return section;
  }
}
