import { DynamicModule, Module, Type } from '@nestjs/common';
import { DashboardQueryService } from './application/dashboard-query.service';
import { DashboardQueryController } from './presentation/http/dashboard-query.controller';
import { DashboardResponseMapper } from './presentation/http/mappers/dashboard-response.mapper';

@Module({
  controllers: [DashboardQueryController],
  providers: [DashboardQueryService, DashboardResponseMapper],
  exports: [DashboardQueryService],
})
export class DashboardModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: DashboardModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
