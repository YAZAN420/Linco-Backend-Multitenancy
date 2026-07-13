import { DynamicModule, Module, Type } from '@nestjs/common';
import { CourseFaqsCommandController } from './presentation/http/courseFaqs-command.controller';
import { CourseFaqsQueryController } from './presentation/http/courseFaqs-query.controller';
import { CourseFaqFactory } from './domain/factories/courseFaq.factory';
import { CourseFaqsCommandService } from './application/courseFaqs-command.service';
import { CourseFaqsQueryService } from './application/courseFaqs-query.service';
import { CourseFaqResponseMapper } from './presentation/http/mappers/courseFaq-response.mapper';

@Module({
  imports: [],
  controllers: [CourseFaqsCommandController, CourseFaqsQueryController],
  providers: [
    CourseFaqsCommandService,
    CourseFaqsQueryService,
    CourseFaqFactory,
    CourseFaqResponseMapper,
  ],
  exports: [
    CourseFaqsCommandService,
    CourseFaqsQueryService,
    CourseFaqFactory,
    CourseFaqResponseMapper,
  ],
})
export class CourseFaqsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CourseFaqsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
