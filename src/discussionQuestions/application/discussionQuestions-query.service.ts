import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindDiscussionQuestionsCursorQuery } from './interfaces/find-discussionQuestions.query';
import { DiscussionQuestion } from 'src/generated/prisma/client';
import { DiscussionQuestionQueryRepository } from './ports/discussionQuestion-query.repository';

@Injectable()
export class DiscussionQuestionsQueryService {
  constructor(
    private readonly discussionQuestionQueryRepository: DiscussionQuestionQueryRepository,
  ) {}

  async findAllCursor(
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestion>> {
    return this.discussionQuestionQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<DiscussionQuestion> {
    const discussionQuestion =
      await this.discussionQuestionQueryRepository.findById(id);
    if (!discussionQuestion)
      throw new NotFoundException('DiscussionQuestion not found');
    return discussionQuestion;
  }
}
