import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindDiscussionQuestionsCursorQuery } from '../interfaces/find-discussionQuestions.query';
import { DiscussionQuestion } from 'src/generated/prisma/client';

export abstract class DiscussionQuestionQueryRepository {
  abstract findAllCursor(
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestion>>;
  abstract findById(id: string): Promise<DiscussionQuestion | null>;
}
