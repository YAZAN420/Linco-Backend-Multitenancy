import { Module } from '@nestjs/common';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { PrismaCourseCommandRepository } from './repositories/prisma-course-command.repository';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';
import { PrismaCourseQueryRepository } from './repositories/prisma-course-query.repository';
import { PrismaCourseMapper } from './mappers/prisma-course.mapper';

@Module({
  providers: [
    PrismaCourseMapper,
    {
      provide: CourseCommandRepository,
      useClass: PrismaCourseCommandRepository,
    },
    {
      provide: CourseQueryRepository,
      useClass: PrismaCourseQueryRepository,
    },
  ],
  exports: [CourseCommandRepository, CourseQueryRepository],
})
export class PrismaPersistenceModule {}
