import { DynamicModule, Module, Type } from '@nestjs/common';
import { QuestionsBanksCommandController } from './presentation/http/questionBank-command.controller';
import { QuestionsBanksQueryController } from './presentation/http/questionBank-query.controller';
import { QuestionsBankFactory } from './domain/factories/questionsBank.factory';
import { QuestionsBanksCommandService } from './application/questionsBank-command.service';
import { QuestionsBanksQueryService } from './application/questionsBank-query.service';
import { QuestionsBankResponseMapper } from './presentation/http/mappers/questionBank-response.mapper';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';
import { PrismaQuestionCoicesMapper } from './infrastructure/persistence/prisma/mappers/prisma-question-choices.mapper';
import { QuestionChoiceFactory } from './domain/factories/question-choice.factory';

@Module({
  imports: [],
  controllers: [QuestionsBanksCommandController, QuestionsBanksQueryController],
  providers: [
    QuestionsBanksCommandService,
    QuestionsBanksQueryService,
    QuestionsBankFactory,
    QuestionsBankResponseMapper,
    PrismaQuestionCoicesMapper,
    PrismaCourseQueryRepository,
    QuestionChoiceFactory
  ],
  exports: [
    QuestionsBanksCommandService,
    QuestionsBanksQueryService,
    QuestionsBankFactory,
    QuestionsBankResponseMapper,
  ],
})
export class QuestionsBanksModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: QuestionsBanksModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
