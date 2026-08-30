import { DynamicModule, Module, Type } from '@nestjs/common';
import { ExamsCommandController } from './presentation/http/exams-command.controller';
import { ExamsCommandService } from './application/exams-command.service';
import { ExamsQueryService } from './application/exams-query.service';
import { ExamResponseMapper } from './presentation/http/mappers/exam-response.mapper';
import { ExamFactory } from './domain/factories/exam.factory';
import { ExamsQueryController } from './presentation/http/exams-query.controller';
import { QuestionsBankResponseMapper } from 'src/questionBanks/presentation/http/mappers/questionBank-response.mapper';
import { ExamsAttemptQueryController } from './presentation/http/exam-attempts-query.controller';
import { ExamAttemptQueryService } from './application/exams-attempts-query.service';

import { ExamAttemptResponseMapper } from './presentation/http/mappers/exam-attempt-response.mapper';
import { ExamAttemptCommandService } from './application/exams-attempts-command.service';
import { ExamsAttemptCommandController } from './presentation/http/exam-attempts-command.controller';
import { PrismaExamAttemptCommandRepository } from './infrastructure/persistence/prisma/repositories/prisma-exam-attempt-command.repository';
import { PrismaExamAttemptQueryRepository } from './infrastructure/persistence/prisma/repositories/prisma-exam-attempt-query.repository';
import { ExamAttemptFactory } from './domain/factories/exam-attempt.factory';
import { PrismaExamAttemptMapper } from './infrastructure/persistence/prisma/mappers/prisma-exam-attempt.mapper';

@Module({
  imports: [],
  controllers: [
    ExamsCommandController,
    ExamsQueryController,
    ExamsAttemptQueryController,
    ExamsAttemptCommandController,
  ],
  providers: [
    ExamsCommandService,
    ExamsQueryService,
    ExamAttemptQueryService,
    ExamAttemptCommandService,
    ExamFactory,
    ExamAttemptFactory,
    ExamResponseMapper,
    ExamAttemptResponseMapper,
    QuestionsBankResponseMapper,
    PrismaExamAttemptMapper,
    PrismaExamAttemptCommandRepository,
    PrismaExamAttemptQueryRepository,
  ],
  exports: [
    ExamsCommandService,
    ExamsQueryService,
    ExamAttemptQueryService,
    ExamAttemptCommandService,
    ExamFactory,
    ExamResponseMapper,
    ExamAttemptResponseMapper,
    QuestionsBankResponseMapper,
  ],
})
export class ExamsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: ExamsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
