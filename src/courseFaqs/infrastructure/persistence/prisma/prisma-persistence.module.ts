import { Module } from '@nestjs/common';
import { CourseFaqCommandRepository } from 'src/courseFaqs/application/ports/courseFaq-command.repository';
import { PrismaCourseFaqCommandRepository } from './repositories/prisma-courseFaq-command.repository';
import { CourseFaqQueryRepository } from 'src/courseFaqs/application/ports/courseFaq-query.repository';
import { PrismaCourseFaqQueryRepository } from './repositories/prisma-courseFaq-query.repository';
import { PrismaCourseFaqMapper } from './mappers/prisma-courseFaq.mapper';

@Module({
  providers: [
    PrismaCourseFaqMapper,
    {
      provide: CourseFaqCommandRepository,
      useClass: PrismaCourseFaqCommandRepository,
    },
    {
      provide: CourseFaqQueryRepository,
      useClass: PrismaCourseFaqQueryRepository,
    },
  ],
  exports: [CourseFaqCommandRepository, CourseFaqQueryRepository],
})
export class PrismaPersistenceModule {}
