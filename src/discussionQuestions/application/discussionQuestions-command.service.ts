import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionQuestionCommandRepository } from './ports/discussionQuestion-command.repository';
import { DiscussionQuestionFactory } from '../domain/factories/discussionQuestion.factory';
import { DiscussionQuestion } from '../domain/discussionQuestion';

import { CreateDiscussionQuestionInput } from './interfaces/create-discussionQuestion-input.interface';
import { UpdateDiscussionQuestionInput } from './interfaces/update-discussionQuestion-input.interface';

@Injectable()
export class DiscussionQuestionsCommandService {
  constructor(
    private readonly discussionQuestionCommandRepository: DiscussionQuestionCommandRepository,
    private readonly discussionQuestionFactory: DiscussionQuestionFactory,
  ) {}

  async create(
    lessonId: string,
    demoMemberId: string,
    input: CreateDiscussionQuestionInput,
  ): Promise<DiscussionQuestion> {
    const discussionQuestion = this.discussionQuestionFactory.createNew(
      input.content,
      lessonId,
      demoMemberId,
    );
    await this.discussionQuestionCommandRepository.save(discussionQuestion);
    return discussionQuestion;
  }

  async update(
    lessonId: string,
    discussionQuestionId: string,
    input: UpdateDiscussionQuestionInput,
  ): Promise<DiscussionQuestion> {
    const discussionQuestion = await this.findById(discussionQuestionId);
    if (input.content) discussionQuestion.updateContent(input.content);
    await this.discussionQuestionCommandRepository.save(discussionQuestion);
    return discussionQuestion;
  }

  async remove(lessonId: string, discussionQuestionId: string): Promise<void> {
    await this.findById(discussionQuestionId);
    await this.discussionQuestionCommandRepository.delete(discussionQuestionId);
  }

  async findById(discussionQuestionId: string): Promise<DiscussionQuestion> {
    const discussionQuestion =
      await this.discussionQuestionCommandRepository.findById(
        discussionQuestionId,
      );
    if (!discussionQuestion)
      throw new NotFoundException('errors.DISCUSSION_QUESTION_NOT_FOUND');
    return discussionQuestion;
  }
}
