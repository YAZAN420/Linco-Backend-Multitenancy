import { Injectable } from '@nestjs/common';
import { DiscussionAnswer } from '../discussionAnswer';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DiscussionAnswerFactory {
  public createNew(
    content: string,
    discussionId: string,
    demoMemberId: string,
  ): DiscussionAnswer {
    const now = new Date();
    return new DiscussionAnswer(uuidv7(), {
      content,
      discussionId,
      demoMemberId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
