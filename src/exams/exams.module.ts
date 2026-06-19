import { DynamicModule, Module, Type } from '@nestjs/common';
import { ExamsCommandController } from './presentation/http/exams-command.controller';
import { ExamsQueryController } from './presentation/http/exams-query.controller';
import { ExamsCommandService } from './application/exams-command.service';
import { ExamsQueryService } from './application/exams-query.service';
import { ExamResponseMapper } from './presentation/http/mappers/exam-response.mapper';
import { ExamFactory } from './domain/factories/exam.factory';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';

@Module({
  imports: [], 
  controllers: [ExamsCommandController, ExamsQueryController],
  providers: [
    ExamsCommandService,
    ExamsQueryService,
    ExamFactory,
    ExamResponseMapper,
    PrismaCourseQueryRepository
    ],
  exports: [
    ExamsCommandService,
    ExamsQueryService,
    ExamFactory,
    ExamResponseMapper
    ],
})
export class ExamsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: ExamsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}