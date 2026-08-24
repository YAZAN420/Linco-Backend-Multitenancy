import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';
import { CourseCommandRepository } from './ports/course-command.repository';
import { SectionQueryRepository } from './ports/section-query.repository';

@Injectable()
export class SectionsQueryService {
  constructor(
    private readonly sectionQueryRepository: SectionQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
  ) {}

  async findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');

    return this.sectionQueryRepository.findSectionsCursor(courseId, options);
  }

  async findById(courseId: string, sectionId: string): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');

    const section =
      await this.sectionQueryRepository.findSectionById(sectionId);
    if (!section)
      throw new NotFoundException('errors.SECTION_NOT_FOUND_IN_THIS_COURSE');
    return section;
  }

  async exists(sectionId: string): Promise<boolean> {
    const section =
      await this.sectionQueryRepository.findSectionById(sectionId);
    return !!section;
  }
}
