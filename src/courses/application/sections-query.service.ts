import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';
import { CourseQueryRepository } from './ports/course-query.repository';
import { CourseCommandRepository } from './ports/course-command.repository';

@Injectable()
export class SectionsQueryService {
  constructor(
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
  ) {}

  async findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    return this.courseQueryRepository.findSectionsCursor(courseId, options);
  }

  async findById(courseId: string, sectionId: string): Promise<Section> {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    const section = await this.courseQueryRepository.findSectionById(sectionId);
    if (!section)
      throw new NotFoundException('Section not found in this course');
    return section;
  }

  async exists(sectionId: string): Promise<boolean> {
    const section = await this.courseQueryRepository.findSectionById(sectionId);
    return !!section;
  }
}
