import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';
import { SectionQueryRepository } from './ports/section-query.repository';
import { SectionExamValidation } from './interfaces/section-exam-validation.interface';
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
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');

    return this.sectionQueryRepository.findAllCursor(courseId, options);
  }

  async findById(courseId: string, sectionId: string): Promise<Section> {
    const course = await this.courseQueryRepository.findById(courseId);
    if (!course) throw new NotFoundException('errors.COURSE_NOT_FOUND');

    const section = await this.sectionQueryRepository.findById(sectionId);
    if (!section)
      throw new NotFoundException('errors.SECTION_NOT_FOUND_IN_THIS_COURSE');

    return section;
  }

  async exists(sectionId: string): Promise<boolean> {
    const section = await this.sectionQueryRepository.findById(sectionId);
    return !!section;
  }

  async getExamValidationData(
    sectionId: string,
  ): Promise<SectionExamValidation> {
    const section =
      await this.sectionQueryRepository.findSectionWithExamAndQuestionCount(
        sectionId,
      );
    if (!section) {
      throw new NotFoundException('errors.SECTION_NOT_FOUND');
    }

    return {
      totalQuestions: section._count.questionsBank,
      requiredExamQuestions: section.exam
        ? section.exam.numberOfQuestions
        : null,
    };
  }
}
