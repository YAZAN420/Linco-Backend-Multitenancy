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
}
