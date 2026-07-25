import { DynamicModule, Module, Type } from '@nestjs/common';
import { ExamsCommandController } from './presentation/http/exams-command.controller';
import { ExamsCommandService } from './application/exams-command.service';
import { ExamsQueryService } from './application/exams-query.service';
import { ExamResponseMapper } from './presentation/http/mappers/exam-response.mapper';
import { ExamFactory } from './domain/factories/exam.factory';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';
import { ExamsQueryController } from './presentation/http/exams-query.controller';
import { PrismaQuestionsBankQueryRepository } from 'src/questionBanks/infrastructure/persistence/prisma/repositories/prisma-questionBank-query.repository';
import { QuestionsBankResponseMapper } from 'src/questionBanks/presentation/http/mappers/questionBank-response.mapper';
import { PrismaQuestionChoicesMapper } from 'src/questionBanks/infrastructure/persistence/prisma/mappers/prisma-question-choices.mapper';
import { PrismaQuestionsBankMapper } from 'src/questionBanks/infrastructure/persistence/prisma/mappers/prisma-questionsBank.mapper';
import { ExamsAttemptQueryController } from './presentation/http/exam-attempts-query.controller';
import { ExamAttemptQueryService } from './application/exams-attempts-query.service';
import { RandomExamFactory } from './domain/factories/random-exam.factory';
import { ExamRandomResponseMapper } from './presentation/http/mappers/random-exam-response.mapper';
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
    RandomExamFactory,

    ExamResponseMapper,
    ExamRandomResponseMapper,
    ExamAttemptResponseMapper,
    QuestionsBankResponseMapper,
    PrismaQuestionsBankMapper,
    PrismaExamAttemptMapper,

    PrismaCourseQueryRepository,
    PrismaExamAttemptCommandRepository,
    PrismaExamAttemptQueryRepository,
    PrismaQuestionsBankQueryRepository,
    PrismaQuestionChoicesMapper,
  ],
  exports: [
    ExamsCommandService,
    ExamsQueryService,
    ExamAttemptQueryService,
    ExamAttemptCommandService,

    ExamFactory,
    RandomExamFactory,

    ExamResponseMapper,
    ExamRandomResponseMapper,
    ExamAttemptResponseMapper,
    QuestionsBankResponseMapper,
    PrismaQuestionsBankMapper,
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
