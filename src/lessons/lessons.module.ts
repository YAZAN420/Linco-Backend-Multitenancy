import { DynamicModule, Module, Type } from '@nestjs/common';
import { LessonsCommandController } from './presentation/http/lessons-command.controller';
import { LessonsQueryController } from './presentation/http/lessons-query.controller';
import { LessonFactory } from './domain/factories/lesson.factory';
import { LessonsCommandService } from './application/lessons-command.service';
import { LessonsQueryService } from './application/lessons-query.service';
import { LessonResponseMapper } from './presentation/http/mappers/lesson-response.mapper';

@Module({
  imports: [],
  controllers: [LessonsCommandController, LessonsQueryController],
  providers: [
    LessonsCommandService,
    LessonsQueryService,
    LessonFactory,
    LessonResponseMapper,
  ],
  exports: [
    LessonsCommandService,
    LessonsQueryService,
    LessonFactory,
    LessonResponseMapper,
  ],
})
export class LessonsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: LessonsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
