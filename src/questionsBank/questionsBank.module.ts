import { DynamicModule, Module, Type } from '@nestjs/common';
import { QuestionsBankCommandController } from './presentation/http/questionsBank-command.controller';
import { QuestionsBankQueryController } from './presentation/http/questionsBank-query.controller';
import { QuestionsBankFactory } from './domain/factories/questionsBank.factory';
import { QuestionsBankCommandService } from './application/questionsBank-command.service';
import { QuestionsBankQueryService } from './application/questionsBank-query.service';
import { QuestionsBankResponseMapper } from './presentation/http/mappers/questionsBank-response.mapper';

@Module({
  imports: [],
  controllers: [QuestionsBankCommandController, QuestionsBankQueryController],
  providers: [
    QuestionsBankCommandService,
    QuestionsBankQueryService,
    QuestionsBankFactory,
    QuestionsBankResponseMapper,
  ],
  exports: [
    QuestionsBankCommandService,
    QuestionsBankQueryService,
    QuestionsBankFactory,
    QuestionsBankResponseMapper,
  ],
})
export class QuestionsBankModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: QuestionsBankModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
