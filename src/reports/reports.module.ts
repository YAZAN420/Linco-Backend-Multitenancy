import { DynamicModule, Module, Type } from '@nestjs/common';
import { ReportsQueryService } from './application/reports-query.service';
import { ReportsQueryController } from './presentation/http/reports-query.controller';

@Module({
  controllers: [ReportsQueryController],
  providers: [ReportsQueryService],
  exports: [ReportsQueryService],
})
export class ReportsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: ReportsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
