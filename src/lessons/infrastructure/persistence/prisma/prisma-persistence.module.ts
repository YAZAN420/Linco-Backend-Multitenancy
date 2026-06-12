import { Module } from '@nestjs/common';
import { LessonCommandRepository } from 'src/lessons/application/ports/lesson-command.repository';
import { PrismaLessonCommandRepository } from './repositories/prisma-lesson-command.repository';
import { LessonQueryRepository } from 'src/lessons/application/ports/lesson-query.repository';
import { PrismaLessonQueryRepository } from './repositories/prisma-lesson-query.repository';
import { PrismaLessonMapper } from './mappers/prisma-lesson.mapper';

@Module({
  providers: [
    PrismaLessonMapper,
    {
      provide: LessonCommandRepository,
      useClass: PrismaLessonCommandRepository,
    },
    {
      provide: LessonQueryRepository,
      useClass: PrismaLessonQueryRepository,
    },
  ],
  exports: [LessonCommandRepository, LessonQueryRepository],
})
export class PrismaPersistenceModule {}
