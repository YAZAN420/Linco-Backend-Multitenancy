import { Module } from '@nestjs/common';
import { DepartmentCourseCommandRepository } from 'src/departmentCourses/application/ports/departmentCourse-command.repository';
import { PrismaDepartmentCourseCommandRepository } from './repositories/prisma-departmentCourse-command.repository';
import { DepartmentCourseQueryRepository } from 'src/departmentCourses/application/ports/departmentCourse-query.repository';
import { PrismaDepartmentCourseQueryRepository } from './repositories/prisma-departmentCourse-query.repository';
import { PrismaDepartmentCourseMapper } from './mappers/prisma-departmentCourse.mapper';

@Module({
  providers: [
    PrismaDepartmentCourseMapper,
    {
      provide: DepartmentCourseCommandRepository,
      useClass: PrismaDepartmentCourseCommandRepository,
    },
    {
      provide: DepartmentCourseQueryRepository,
      useClass: PrismaDepartmentCourseQueryRepository,
    },
  ],
  exports: [DepartmentCourseCommandRepository, DepartmentCourseQueryRepository],
})
export class PrismaPersistenceModule {}
