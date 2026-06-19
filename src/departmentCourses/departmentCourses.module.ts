import { DynamicModule, Module, Type } from '@nestjs/common';
import { DepartmentCoursesCommandController } from './presentation/http/departmentCourses-command.controller';
import { DepartmentCoursesQueryController } from './presentation/http/departmentCourses-query.controller';
import { DepartmentCourseFactory } from './domain/factories/departmentCourse.factory';
import { DepartmentCoursesCommandService } from './application/departmentCourses-command.service';
import { DepartmentCoursesQueryService } from './application/departmentCourses-query.service';
import { DepartmentCourseResponseMapper } from './presentation/http/mappers/departmentCourse-response.mapper';

@Module({
  imports: [],
  controllers: [
    DepartmentCoursesCommandController,
    DepartmentCoursesQueryController,
  ],
  providers: [
    DepartmentCoursesCommandService,
    DepartmentCoursesQueryService,
    DepartmentCourseFactory,
    DepartmentCourseResponseMapper,
  ],
  exports: [
    DepartmentCoursesCommandService,
    DepartmentCoursesQueryService,
    DepartmentCourseFactory,
    DepartmentCourseResponseMapper,
  ],
})
export class DepartmentCoursesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: DepartmentCoursesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
