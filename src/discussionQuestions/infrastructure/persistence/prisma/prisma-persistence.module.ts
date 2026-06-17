import { Module } from '@nestjs/common';
import { DiscussionQuestionCommandRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-command.repository';
import { PrismaDiscussionQuestionCommandRepository } from './repositories/prisma-discussionQuestion-command.repository';
import { DiscussionQuestionQueryRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-query.repository';
import { PrismaDiscussionQuestionQueryRepository } from './repositories/prisma-discussionQuestion-query.repository';
import { PrismaDiscussionQuestionMapper } from './mappers/prisma-discussionQuestion.mapper';

@Module({
  providers: [
    PrismaDiscussionQuestionMapper,
    {
      provide: DiscussionQuestionCommandRepository,
      useClass: PrismaDiscussionQuestionCommandRepository,
    },
    {
      provide: DiscussionQuestionQueryRepository,
      useClass: PrismaDiscussionQuestionQueryRepository,
    },
  ],
  exports: [
    DiscussionQuestionCommandRepository,
    DiscussionQuestionQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
