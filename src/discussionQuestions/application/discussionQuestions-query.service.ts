import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindDiscussionQuestionsCursorQuery } from './interfaces/find-discussionQuestions.query';
import { DiscussionQuestionQueryRepository } from './ports/discussionQuestion-query.repository';
import { DiscussionQuestionWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class DiscussionQuestionsQueryService {
  constructor(
    private readonly discussionQuestionQueryRepository: DiscussionQuestionQueryRepository,
  ) {}

  async findAllCursor(
    lessonId: string,
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestionWithDemoMember>> {
    return this.discussionQuestionQueryRepository.findAllCursor(options);
  }

  async findById(
    lessonId: string,
    id: string,
  ): Promise<DiscussionQuestionWithDemoMember> {
    const discussionQuestion =
      await this.discussionQuestionQueryRepository.findById(id);
    if (!discussionQuestion)
      throw new NotFoundException('DiscussionQuestion not found');
    return discussionQuestion;
  }
}
