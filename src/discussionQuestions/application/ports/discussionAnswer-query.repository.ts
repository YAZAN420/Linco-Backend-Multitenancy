import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindDiscussionAnswersCursorQuery } from '../interfaces/find-discussionAnswers.query';
import { DiscussionAnswerWithDemoMember } from 'src/core/database/prisma/types';

export abstract class DiscussionAnswerQueryRepository {
  abstract findAllCursor(
    discussionId: string,
    options: FindDiscussionAnswersCursorQuery,
  ): Promise<CursorPageDto<DiscussionAnswerWithDemoMember>>;
  abstract findById(id: string): Promise<DiscussionAnswerWithDemoMember | null>;
}
