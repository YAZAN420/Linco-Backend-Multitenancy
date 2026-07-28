import { DynamicModule, Module, Type } from '@nestjs/common';

import { DepartmentMessagesQueryController } from './presentation/http/departmentMessages-query.controller';
import { DepartmentMessageFactory } from './domain/factories/departmentMessage.factory';
import { DepartmentMessagesCommandService } from './application/departmentMessages-command.service';
import { DepartmentMessagesQueryService } from './application/departmentMessages-query.service';
import { DepartmentMessageResponseMapper } from './presentation/mappers/departmentMessage-response.mapper';
import { DepartmentMessagesGateway } from './presentation/ws/departmentMessages.gateway';

@Module({
  imports: [],
  controllers: [DepartmentMessagesQueryController],
  providers: [
    DepartmentMessagesCommandService,
    DepartmentMessagesQueryService,
    DepartmentMessageFactory,
    DepartmentMessageResponseMapper,
    DepartmentMessagesGateway,
  ],
  exports: [
    DepartmentMessagesCommandService,
    DepartmentMessagesQueryService,
    DepartmentMessageFactory,
    DepartmentMessageResponseMapper,
    DepartmentMessagesGateway,
  ],
})
export class DepartmentMessagesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: DepartmentMessagesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
