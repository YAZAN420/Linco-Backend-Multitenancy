import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscussionQuestionsCommandController } from './presentation/http/discussionQuestions-command.controller';
import { DiscussionQuestionsQueryController } from './presentation/http/discussionQuestions-query.controller';
import { DiscussionQuestionFactory } from './domain/factories/discussionQuestion.factory';
import { DiscussionQuestionsCommandService } from './application/discussionQuestions-command.service';
import { DiscussionQuestionsQueryService } from './application/discussionQuestions-query.service';
import { DiscussionQuestionResponseMapper } from './presentation/http/mappers/discussionQuestion-response.mapper';

import { DiscussionAnswersCommandController } from './presentation/http/discussionAnswers-command.controller';
import { DiscussionAnswersQueryController } from './presentation/http/discussionAnswers-query.controller';
import { DiscussionAnswerFactory } from './domain/factories/discussionAnswer.factory';
import { DiscussionAnswersCommandService } from './application/discussionAnswers-command.service';
import { DiscussionAnswersQueryService } from './application/discussionAnswers-query.service';
import { DiscussionAnswerResponseMapper } from './presentation/http/mappers/discussionAnswer-response.mapper';

@Module({
  imports: [],
  controllers: [
    DiscussionQuestionsCommandController,
    DiscussionQuestionsQueryController,

    DiscussionAnswersCommandController,
    DiscussionAnswersQueryController,
  ],
  providers: [
    DiscussionQuestionsCommandService,
    DiscussionQuestionsQueryService,
    DiscussionQuestionFactory,
    DiscussionQuestionResponseMapper,

    DiscussionAnswersCommandService,
    DiscussionAnswersQueryService,
    DiscussionAnswerFactory,
    DiscussionAnswerResponseMapper,
  ],
  exports: [
    DiscussionQuestionsCommandService,
    DiscussionQuestionsQueryService,
    DiscussionQuestionFactory,
    DiscussionQuestionResponseMapper,

    DiscussionAnswersCommandService,
    DiscussionAnswersQueryService,
    DiscussionAnswerFactory,
    DiscussionAnswerResponseMapper,
  ],
})
export class DiscussionQuestionsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: DiscussionQuestionsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
