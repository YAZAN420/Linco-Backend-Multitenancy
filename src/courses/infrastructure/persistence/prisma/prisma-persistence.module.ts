import { Module } from '@nestjs/common';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { PrismaCourseCommandRepository } from './repositories/prisma-course-command.repository';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';
import { PrismaCourseQueryRepository } from './repositories/prisma-course-query.repository';
import { PrismaCourseMapper } from './mappers/prisma-course.mapper';
import { PrismaSectionMapper } from './mappers/prisma-section.mapper';
import { SectionQueryRepository } from 'src/courses/application/ports/section-query.repository';
import { PrismaSectionQueryRepository } from './repositories/prisma-section-query.repository';

@Module({
  providers: [
    PrismaCourseMapper,
    PrismaSectionMapper,
    {
      provide: CourseCommandRepository,
      useClass: PrismaCourseCommandRepository,
    },
    {
      provide: CourseQueryRepository,
      useClass: PrismaCourseQueryRepository,
    },
    {
      provide: SectionQueryRepository,
      useClass: PrismaSectionQueryRepository,
    },
  ],
  exports: [
    CourseCommandRepository,
    CourseQueryRepository,
    SectionQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
