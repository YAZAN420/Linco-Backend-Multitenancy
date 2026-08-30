import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindQuestionsBankCursorQuery } from './interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';

import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Injectable()
export class QuestionsBanksQueryService {
  constructor(
    private readonly questionsBankQueryRepository: QuestionsBankQueryRepository,
    private readonly sectionsQueryService: SectionsQueryService,
  ) {}

  async findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>> {
    const section = await this.sectionsQueryService.exists(sectionId);
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');
    return this.questionsBankQueryRepository.findAllCursor(sectionId, options);
  }

  async findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices> {
    const section = await this.sectionsQueryService.exists(sectionId);
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const questionsBank = await this.questionsBankQueryRepository.findById(
      sectionId,
      id,
    );
    if (!questionsBank)
      throw new NotFoundException('errors.QUESTIONS_BANK_NOT_FOUND');
    return questionsBank;
  }

  async findCorrectChoicesByQuestionIds(
    questionIds: string[],
  ): Promise<{ questionId: string; correctChoiceIds: string[] }[]> {
    return this.questionsBankQueryRepository.findCorrectChoicesByQuestionIds(
      questionIds,
    );
  }

  async findByIdWithoutSection(
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices> {
    const question =
      await this.questionsBankQueryRepository.findByIdWithoutSection(id);
    if (!question)
      throw new NotFoundException('errors.QUESTIONS_BANK_NOT_FOUND');
    return question;
  }

  async getRandomQuestions(
    sectionId: string,
    limit: number,
  ): Promise<QuestionsBankWithQuestionChoices[]> {
    return this.questionsBankQueryRepository.getRandomQuestions(
      sectionId,
      limit,
    );
  }
}
