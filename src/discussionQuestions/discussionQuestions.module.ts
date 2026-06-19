import { DynamicModule, Module, Type } from '@nestjs/common';
import { DiscussionQuestionsCommandController } from './presentation/http/discussionQuestions-command.controller';
import { DiscussionQuestionsQueryController } from './presentation/http/discussionQuestions-query.controller';
import { DiscussionQuestionFactory } from './domain/factories/discussionQuestion.factory';
import { DiscussionQuestionsCommandService } from './application/discussionQuestions-command.service';
import { DiscussionQuestionsQueryService } from './application/discussionQuestions-query.service';
import { DiscussionQuestionResponseMapper } from './presentation/http/mappers/discussionQuestion-response.mapper';

@Module({
  imports: [],
  controllers: [
    DiscussionQuestionsCommandController,
    DiscussionQuestionsQueryController,
  ],
  providers: [
    DiscussionQuestionsCommandService,
    DiscussionQuestionsQueryService,
    DiscussionQuestionFactory,
    DiscussionQuestionResponseMapper,
  ],
  exports: [
    DiscussionQuestionsCommandService,
    DiscussionQuestionsQueryService,
    DiscussionQuestionFactory,
    DiscussionQuestionResponseMapper,
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
