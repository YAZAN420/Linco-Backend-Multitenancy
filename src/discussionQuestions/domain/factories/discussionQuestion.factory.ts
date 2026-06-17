import { Injectable } from '@nestjs/common';
import { DiscussionQuestion } from '../discussionQuestion';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DiscussionQuestionFactory {
  public createNew(
    content: string,
    lessonId: string,
    demoMemberId: string,
  ): DiscussionQuestion {
    const now = new Date();
    return new DiscussionQuestion(uuidv7(), {
      content,
      lessonId,
      demoMemberId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
