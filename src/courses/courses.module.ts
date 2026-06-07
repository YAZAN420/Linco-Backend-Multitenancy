import { DynamicModule, Module, Type } from '@nestjs/common';
import { CoursesCommandController } from './presentation/http/courses-command.controller';
import { CoursesQueryController } from './presentation/http/courses-query.controller';
import { CourseFactory } from './domain/factories/course.factory';
import { CoursesCommandService } from './application/courses-command.service';
import { CoursesQueryService } from './application/courses-query.service';
import { CourseResponseMapper } from './presentation/http/mappers/course-response.mapper';

@Module({
  imports: [],
  controllers: [CoursesCommandController, CoursesQueryController],
  providers: [
    CoursesCommandService,
    CoursesQueryService,
    CourseFactory,
    CourseResponseMapper,
  ],
  exports: [
    CoursesCommandService,
    CoursesQueryService,
    CourseFactory,
    CourseResponseMapper,
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
