import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionQuestionCommandRepository } from './ports/discussionQuestion-command.repository';
import { DiscussionQuestionFactory } from '../domain/factories/discussionQuestion.factory';
import { DiscussionQuestion } from '../domain/discussionQuestion';

import { CreateDiscussionQuestionInput } from './interfaces/create-discussionQuestion-input.interface';
import { UpdateDiscussionQuestionInput } from './interfaces/update-discussionQuestion-input.interface';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member/demo-member-query.repository';

@Injectable()
export class DiscussionQuestionsCommandService {
  constructor(
    private readonly discussionQuestionCommandRepository: DiscussionQuestionCommandRepository,
    private readonly discussionQuestionFactory: DiscussionQuestionFactory,
    private readonly demoMemberQueryRepository: DemoMemberQueryRepository,
  ) {}

  async create(
    lessonId: string,
    userId: string,
    input: CreateDiscussionQuestionInput,
  ): Promise<DiscussionQuestion> {
    const demoMember =
      await this.demoMemberQueryRepository.findDemoMemberByUserId(userId);
    if (!demoMember) throw new NotFoundException('Not member in this demo');

    const discussionQuestion = this.discussionQuestionFactory.createNew(
      input.content,
      lessonId,
      demoMember.id,
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
      throw new NotFoundException('discussionQuestion not found');
    return discussionQuestion;
  }
}
