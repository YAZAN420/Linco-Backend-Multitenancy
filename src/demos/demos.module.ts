import { DynamicModule, Module, Type } from '@nestjs/common';
import { DemosCommandController } from './presentation/http/demo-command.controller';
import { DemosQueryController } from './presentation/http/demo-query.controller';
import { DemoFactory } from './domain/factories/demo.factory';
import { DemosCommandService } from './application/demos-command.service';
import { DemosQueryService } from './application/demos-query.service';
import { DemoResponseMapper } from './presentation/http/mappers/demo-response.mapper';
import { AdminDemosQueryController } from './presentation/http/admin-demo-query.controller';

@Module({
  imports: [],
  controllers: [
    DemosCommandController,
    DemosQueryController,
    AdminDemosQueryController,
  ],
  providers: [
    DemosCommandService,
    DemosQueryService,
    DemoFactory,
    DemoResponseMapper,
  ],
  exports: [
    DemosCommandService,
    DemosQueryService,
    DemoFactory,
    DemoResponseMapper,
  ],
})
export class DemosModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: DemosModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
