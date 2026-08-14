import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindDiscussionQuestionsCursorQuery } from '../interfaces/find-discussionQuestions.query';
import { DiscussionQuestionWithDemoMember } from 'src/core/database/prisma/types';

export abstract class DiscussionQuestionQueryRepository {
  abstract findAllCursor(
    lessonId: string,
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestionWithDemoMember>>;
  abstract findById(
    id: string,
  ): Promise<DiscussionQuestionWithDemoMember | null>;
}
