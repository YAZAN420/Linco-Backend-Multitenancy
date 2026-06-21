import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from './interfaces/find-questionsBank.query';
import { QuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';
import { PrismaQuestionCoicesMapper } from '../infrastructure/persistence/prisma/mappers/prisma-question-choices.mapper';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

@Injectable()
export class QuestionsBanksQueryService {
  constructor(
    private readonly questionsBankQueryRepository: QuestionsBankQueryRepository,
    private readonly sectionsQueryService: PrismaCourseQueryRepository,
  ) {}

  async findAll(
    sectionId: string,
    pageOptionsDto: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionsBankWithQuestionChoices>> {
    await this.sectionsQueryService.findSectionById(sectionId);
    return this.questionsBankQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>> {
    await this.sectionsQueryService.findSectionById(sectionId);
    return this.questionsBankQueryRepository.findAllCursor(options);
  }

  async findById(
    sectionId: string,
    id: string,
  ): Promise<QuestionsBankWithQuestionChoices> {
    await this.sectionsQueryService.findSectionById(sectionId);
    const questionsBank = await this.questionsBankQueryRepository.findById(id);
    if (!questionsBank) throw new NotFoundException('QuestionsBank not found');
    return questionsBank;
  }
}
