import { Module } from '@nestjs/common';
import { ExamCommandRepository } from 'src/exams/application/ports/exam-command.repository';
import { PrismaExamCommandRepository } from './repositories/prisma-exam-command.repository';
import { ExamQueryRepository } from 'src/exams/application/ports/exam-query.repository';
import { PrismaExamQueryRepository } from './repositories/prisma-exam-query.repository';
import { PrismaExamMapper } from './mappers/prisma-exam.mapper';
import { PrismaQuestionsBankMapper } from 'src/questionBanks/infrastructure/persistence/prisma/mappers/prisma-questionsBank.mapper';
import { PrismaQuestionChoicesMapper } from 'src/questionBanks/infrastructure/persistence/prisma/mappers/prisma-question-choices.mapper';
import { ExamAttemptCommandRepository } from 'src/exams/application/ports/exam-attempt-command.repository';
import { PrismaExamAttemptCommandRepository } from './repositories/prisma-exam-attempt-command.repository';
import { ExamAttemptQueryRepository } from 'src/exams/application/ports/exam-attempt-query.repository';
import { PrismaExamAttemptMapper } from './mappers/prisma-exam-attempt.mapper';
import { PrismaExamAttemptQueryRepository } from './repositories/prisma-exam-attempt-query.repository';

@Module({
  providers: [
    PrismaExamMapper,
    {
      provide: ExamCommandRepository,
      useClass: PrismaExamCommandRepository,
    },
    {
      provide: ExamQueryRepository,
      useClass: PrismaExamQueryRepository,
    },
    {
      provide: ExamAttemptCommandRepository,
      useClass: PrismaExamAttemptCommandRepository,
    },
    {
      provide: ExamAttemptQueryRepository,
      useClass: PrismaExamAttemptQueryRepository,
    },
    PrismaQuestionsBankMapper,
    PrismaQuestionChoicesMapper,
    PrismaExamAttemptMapper,
  ],
  exports: [
    ExamCommandRepository,
    ExamQueryRepository,
    ExamAttemptCommandRepository,
    ExamAttemptQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
