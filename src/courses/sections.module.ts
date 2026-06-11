import { DynamicModule, Module, Type } from '@nestjs/common';
import { CourseFactory } from './domain/factories/course.factory';
import { CourseResponseMapper } from './presentation/http/mappers/course-response.mapper';
import { SectionsCommandController } from './presentation/http/sections-command.controller';
import { SectionsQueryController } from './presentation/http/sections-query.controller';
import { SectionsCommandService } from './application/sections-command.service';
import { SectionsQueryService } from './application/sections-query.service';

@Module({
  imports: [],
  controllers: [SectionsCommandController, SectionsQueryController],
  providers: [
    SectionsCommandService,
    SectionsQueryService,
    CourseFactory,
    CourseResponseMapper,
  ],
  exports: [
    SectionsCommandService,
    SectionsQueryService,
    CourseFactory,
    CourseResponseMapper,
  ],
})
export class SectionsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: SectionsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
