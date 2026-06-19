import { Module } from '@nestjs/common';
import { ExamCommandRepository } from 'src/exams/application/ports/exam-command.repository';
import { PrismaExamCommandRepository } from './repositories/prisma-exam-command.repository';
import { ExamQueryRepository } from 'src/exams/application/ports/exam-query.repository';
import { PrismaExamQueryRepository } from './repositories/prisma-exam-query.repository';
import { PrismaExamMapper } from './mappers/prisma-exam.mapper';

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
  ],
  exports: [ExamCommandRepository, ExamQueryRepository],
})
export class PrismaPersistenceModule {}
