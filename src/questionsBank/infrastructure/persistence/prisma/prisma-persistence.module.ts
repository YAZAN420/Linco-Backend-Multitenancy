import { Module } from '@nestjs/common';
import { QuestionsBankCommandRepository } from 'src/questionsBank/application/ports/questionsBank-command.repository';
import { PrismaQuestionsBankCommandRepository } from './repositories/prisma-questionsBank-command.repository';
import { QuestionsBankQueryRepository } from 'src/questionsBank/application/ports/questionsBank-query.repository';
import { PrismaQuestionsBankQueryRepository } from './repositories/prisma-questionsBank-query.repository';
import { PrismaQuestionsBankMapper } from './mappers/prisma-questionsBank.mapper';

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
  ],
  exports: [QuestionsBankCommandRepository, QuestionsBankQueryRepository],
})
export class PrismaPersistenceModule {}
