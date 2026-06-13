import { DynamicModule, Module, Type } from '@nestjs/common';
import { LessonsCommandController } from './presentation/http/lessons-command.controller';
import { LessonsQueryController } from './presentation/http/lessons-query.controller';
import { LessonFactory } from './domain/factories/lesson.factory';
import { LessonsCommandService } from './application/lessons-command.service';
import { LessonsQueryService } from './application/lessons-query.service';
import { LessonResponseMapper } from './presentation/http/mappers/lesson-response.mapper';
import { AttachmentFactory } from './domain/factories/attachment.factory';
import { AttachmentResponseMapper } from './presentation/http/mappers/attachment-response.mapper';
import { AttachmentsCommandController } from './presentation/http/attachment-command.controller';
import { AttachmentsQueryController } from './presentation/http/attachment-query.controller';
import { AttachmentQueryService } from './application/attachment-query.service';
import { AttachmentCommandService } from './application/attachment-command.service';

@Module({
  imports: [],
  controllers: [
    LessonsCommandController,
    LessonsQueryController,
    AttachmentsCommandController,
    AttachmentsQueryController,
  ],
  providers: [
    LessonsCommandService,
    LessonsQueryService,
    AttachmentCommandService,
    AttachmentQueryService,
    AttachmentFactory,
    LessonFactory,
    AttachmentResponseMapper,
    LessonResponseMapper,
  ],
  exports: [
    LessonsCommandService,
    LessonsQueryService,
    AttachmentCommandService,
    AttachmentQueryService,
    LessonFactory,
    AttachmentFactory,
    LessonResponseMapper,
    AttachmentResponseMapper,
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
