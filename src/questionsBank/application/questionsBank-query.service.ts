import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from './interfaces/find-questionsBank.query';
import { QuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBankQueryRepository } from './ports/questionsBank-query.repository';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Injectable()
export class QuestionsBankQueryService {
  constructor(
    private readonly questionsBankQueryRepository: QuestionsBankQueryRepository,
    private readonly sectionsQueryService: SectionsQueryService
  ) {}

  async findAll(
    courseId: string,
    sectionId: string,
    pageOptionsDto: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionsBank>> {
    this.sectionsQueryService.findById(courseId, sectionId);
    return this.questionsBankQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    courseId: string,
    sectionId: string,
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBank>> {
    this.sectionsQueryService.findById(courseId, sectionId);
    return this.questionsBankQueryRepository.findAllCursor(options);
  }

  async findById(courseId: string, sectionId: string, id: string): Promise<QuestionsBank> {
    this.sectionsQueryService.findById(courseId, sectionId);
    const questionsBank = await this.questionsBankQueryRepository.findById(id);
    if (!questionsBank) throw new NotFoundException('QuestionsBank not found');
    return questionsBank;
  }
}
