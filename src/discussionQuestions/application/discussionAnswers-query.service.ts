import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindDiscussionAnswersCursorQuery } from './interfaces/find-discussionAnswers.query';
import { DiscussionAnswerQueryRepository } from './ports/discussionAnswer-query.repository';
import { DiscussionAnswerWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class DiscussionAnswersQueryService {
  constructor(
    private readonly discussionAnswerQueryRepository: DiscussionAnswerQueryRepository,
  ) {}

  async findAllCursor(
    discussionId: string,
    options: FindDiscussionAnswersCursorQuery,
  ): Promise<CursorPageDto<DiscussionAnswerWithDemoMember>> {
    return this.discussionAnswerQueryRepository.findAllCursor(
      discussionId,
      options,
    );
  }

  async findById(id: string): Promise<DiscussionAnswerWithDemoMember> {
    const discussionAnswer =
      await this.discussionAnswerQueryRepository.findById(id);
    if (!discussionAnswer)
      throw new NotFoundException('DiscussionAnswer not found');
    return discussionAnswer;
  }
}
