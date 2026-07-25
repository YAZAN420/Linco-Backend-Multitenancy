import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindQuestionsBankCursorQuery } from './interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';

import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';

@Injectable()
export class QuestionsBanksQueryService {
  constructor(
    private readonly questionsBankQueryRepository: QuestionsBankQueryRepository,
    private readonly sectionsQueryService: CourseQueryRepository,
  ) {}

  async findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>> {
    await this.sectionsQueryService.findSectionById(sectionId);
    return this.questionsBankQueryRepository.findAllCursor(sectionId, options);
  }

  async findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices> {
    await this.sectionsQueryService.findSectionById(sectionId);
    const questionsBank = await this.questionsBankQueryRepository.findById(
      sectionId,
      id,
    );
    if (!questionsBank) throw new NotFoundException('QuestionsBank not found');
    return questionsBank;
  }
}
