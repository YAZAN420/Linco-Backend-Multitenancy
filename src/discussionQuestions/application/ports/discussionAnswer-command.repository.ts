import { DiscussionAnswer } from '../../domain/discussionAnswer';

export abstract class DiscussionAnswerCommandRepository {
  abstract save(discussionAnswer: DiscussionAnswer): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<DiscussionAnswer | null>;
}
