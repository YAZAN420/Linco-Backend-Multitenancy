import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { CoursesCommandController } from './presentation/http/courses-command.controller';
import { CoursesQueryController } from './presentation/http/courses-query.controller';
import { CourseFactory } from './domain/factories/course.factory';
import { CoursesCommandService } from './application/courses-command.service';
import { CoursesQueryService } from './application/courses-query.service';
import { CourseResponseMapper } from './presentation/http/mappers/course-response.mapper';
import { SectionsCommandController } from './presentation/http/sections-command.controller';
import { SectionsQueryController } from './presentation/http/sections-query.controller';
import { SectionsCommandService } from './application/sections-command.service';
import { SectionsQueryService } from './application/sections-query.service';
import { SectionFactory } from './domain/factories/section.factory';
import { SectionResponseMapper } from './presentation/http/mappers/section-response.mapper';
import { TagsModule } from 'src/tags/tags.module';
import { LessonsModule } from 'src/lessons/lessons.module';
import { LessonsInfrastructureModule } from 'src/lessons/infrastructure/lessons-infrastructure.module';

@Global()
@Module({
  imports: [
    TagsModule,
    LessonsModule.withInfrastructure(LessonsInfrastructureModule.use()),
  ],
  controllers: [
    CoursesCommandController,
    CoursesQueryController,
    SectionsCommandController,
    SectionsQueryController,
  ],
  providers: [
    CoursesCommandService,
    CoursesQueryService,
    CourseFactory,
    SectionFactory,
    CourseResponseMapper,
    SectionResponseMapper,
    SectionsCommandService,
    SectionsQueryService,
  ],
  exports: [
    CoursesCommandService,
    CoursesQueryService,
    CourseFactory,
    SectionFactory,
    CourseResponseMapper,
    SectionResponseMapper,
    SectionsCommandService,
    SectionsQueryService,
  ],
})
export class CoursesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CoursesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
