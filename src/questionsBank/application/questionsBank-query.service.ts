import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from './interfaces/find-questionsBank.query';
import { QuestionBank } from 'src/generated/prisma/client';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';

@Injectable()
export class QuestionsBankQueryService {
  constructor(
    private readonly questionsBankQueryRepository: QuestionsBankQueryRepository
  ) {}

  async findAll(
    sectionId: string,
    pageOptionsDto: FindQuestionsBankQuery
  ): Promise<PageDto<QuestionBank>> {
    return this.questionsBankQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionBank>> {
    return this.questionsBankQueryRepository.findAllCursor(options);
  }

  async findById(sectionId: string, id: string): Promise<QuestionBank> {
    const questionsBank = await this.questionsBankQueryRepository.findById(id);
    if (!questionsBank) throw new NotFoundException('QuestionBank not found');
    return questionsBank;
  }
}
