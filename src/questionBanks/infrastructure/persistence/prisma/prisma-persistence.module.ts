import { Module } from '@nestjs/common';
import { QuestionsBankCommandRepository } from 'src/questionBanks/application/ports/questionsBank-command.repository';
import { PrismaQuestionsBankCommandRepository } from './repositories/prisma-questionBank-command.repository';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { PrismaQuestionsBankQueryRepository } from './repositories/prisma-questionBank-query.repository';
import { PrismaQuestionsBankMapper } from './mappers/prisma-questionsBank.mapper';
import { PrismaQuestionCoicesMapper } from './mappers/prisma-question-choices.mapper';

@Module({
  providers: [
    PrismaQuestionsBankMapper,
    {
      provide: QuestionsBankCommandRepository,
      useClass: PrismaQuestionsBankCommandRepository,
    },
    {
      provide: QuestionsBankQueryRepository,
      useClass: PrismaQuestionsBankQueryRepository,
    },
    PrismaQuestionCoicesMapper,
    PrismaQuestionsBankMapper
  ],
  exports: [QuestionsBankCommandRepository, QuestionsBankQueryRepository],
})
export class PrismaPersistenceModule {}
