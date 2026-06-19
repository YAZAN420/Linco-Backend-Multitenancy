import { DiscussionQuestion } from 'src/discussionQuestions/domain/discussionQuestion';

export abstract class DiscussionQuestionCommandRepository {
  abstract save(discussionQuestion: DiscussionQuestion): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<DiscussionQuestion | null>;
}
