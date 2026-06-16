import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from './interfaces/find-questionsBank.query';
import { QuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';
import { WithRealtionsDto } from 'src/common/dtos/with-realtions.dto';

@Injectable()
export class QuestionsBankQueryService {
  constructor(private readonly questionsBankQueryRepository: QuestionsBankQueryRepository) {}

  async findAll(pageOptionsDto: FindQuestionsBankQuery): Promise<PageDto<QuestionsBank>> {
    return this.questionsBankQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBank>> {
    return this.questionsBankQueryRepository.findAllCursor(options);
  }

  async findById(id: string, options?: WithRealtionsDto): Promise<QuestionsBank> {
    const questionsBank = await this.questionsBankQueryRepository.findById(id, options);
    if (!questionsBank) throw new NotFoundException('QuestionsBank not found');
    return questionsBank;
  }
}
