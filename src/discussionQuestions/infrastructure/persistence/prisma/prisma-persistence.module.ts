import { Module } from '@nestjs/common';
// --- Questions Repositories & Mappers ---
import { DiscussionQuestionCommandRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-command.repository';
import { PrismaDiscussionQuestionCommandRepository } from './repositories/prisma-discussionQuestion-command.repository';
import { DiscussionQuestionQueryRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-query.repository';
import { PrismaDiscussionQuestionQueryRepository } from './repositories/prisma-discussionQuestion-query.repository';
import { PrismaDiscussionQuestionMapper } from './mappers/prisma-discussionQuestion.mapper';

// --- Answers Repositories & Mappers ---
import { DiscussionAnswerCommandRepository } from 'src/discussionQuestions/application/ports/discussionAnswer-command.repository';
import { PrismaDiscussionAnswerCommandRepository } from './repositories/prisma-discussionAnswer-command.repository';
import { DiscussionAnswerQueryRepository } from 'src/discussionQuestions/application/ports/discussionAnswer-query.repository';
import { PrismaDiscussionAnswerQueryRepository } from './repositories/prisma-discussionAnswer-query.repository';
import { PrismaDiscussionAnswerMapper } from './mappers/prisma-discussionAnswer.mapper';

@Module({
  providers: [
    PrismaDiscussionQuestionMapper,
    PrismaDiscussionAnswerMapper,

    {
      provide: DiscussionQuestionCommandRepository,
      useClass: PrismaDiscussionQuestionCommandRepository,
    },
    {
      provide: DiscussionQuestionQueryRepository,
      useClass: PrismaDiscussionQuestionQueryRepository,
    },

    {
      provide: DiscussionAnswerCommandRepository,
      useClass: PrismaDiscussionAnswerCommandRepository,
    },
    {
      provide: DiscussionAnswerQueryRepository,
      useClass: PrismaDiscussionAnswerQueryRepository,
    },
  ],
  exports: [
    DiscussionQuestionCommandRepository,
    DiscussionQuestionQueryRepository,
    DiscussionAnswerCommandRepository,
    DiscussionAnswerQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
