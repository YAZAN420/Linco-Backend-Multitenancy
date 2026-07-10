import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionAnswerCommandRepository } from './ports/discussionAnswer-command.repository';
import { DiscussionQuestionQueryRepository } from './ports/discussionQuestion-query.repository';
import { DiscussionAnswerFactory } from '../domain/factories/discussionAnswer.factory';
import { DiscussionAnswer } from '../domain/discussionAnswer';
import { CreateDiscussionAnswerInput } from './interfaces/create-discussionAnswer-input.interface';
import { UpdateDiscussionAnswerInput } from './interfaces/update-discussionAnswer-input.interface';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member/demo-member-query.repository';

@Injectable()
export class DiscussionAnswersCommandService {
  constructor(
    private readonly discussionAnswerCommandRepository: DiscussionAnswerCommandRepository,
    private readonly discussionQuestionQueryRepository: DiscussionQuestionQueryRepository,
    private readonly discussionAnswerFactory: DiscussionAnswerFactory,
    private readonly demoMemberQueryRepository: DemoMemberQueryRepository,
  ) {}

  async create(
    discussionId: string,
    userId: string,
    input: CreateDiscussionAnswerInput,
  ): Promise<DiscussionAnswer> {
    const demoMember =
      await this.demoMemberQueryRepository.findDemoMemberByUserId(userId);
    if (!demoMember) throw new NotFoundException('Not member in this demo');

    const question =
      await this.discussionQuestionQueryRepository.findById(discussionId);
    if (!question) throw new NotFoundException('Discussion question not found');

    const discussionAnswer = this.discussionAnswerFactory.createNew(
      input.content,
      discussionId,
      demoMember.id,
    );
    await this.discussionAnswerCommandRepository.save(discussionAnswer);
    return discussionAnswer;
  }

  async update(
    answerId: string,
    input: UpdateDiscussionAnswerInput,
  ): Promise<DiscussionAnswer> {
    const discussionAnswer = await this.findById(answerId);
    if (input.content) discussionAnswer.updateContent(input.content);
    await this.discussionAnswerCommandRepository.save(discussionAnswer);
    return discussionAnswer;
  }

  async remove(answerId: string): Promise<void> {
    await this.findById(answerId);
    await this.discussionAnswerCommandRepository.delete(answerId);
  }

  async findById(answerId: string): Promise<DiscussionAnswer> {
    const discussionAnswer =
      await this.discussionAnswerCommandRepository.findById(answerId);
    if (!discussionAnswer)
      throw new NotFoundException('DiscussionAnswer not found');
    return discussionAnswer;
  }
}
