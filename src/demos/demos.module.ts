import { DynamicModule, Module, Type } from '@nestjs/common';
import { DemosCommandController } from './presentation/http/demo-command.controller';
import { DemosQueryController } from './presentation/http/demo-query.controller';
import { DemoFactory } from './domain/factories/demo.factory';
import { DemosCommandService } from './application/demos-command.service';
import { DemosQueryService } from './application/demos-query.service';
import { DemoResponseMapper } from './presentation/http/mappers/demo-response.mapper';
import { AdminDemosQueryController } from './presentation/http/admin-demo-query.controller';
import { DepartmentFactory } from './domain/factories/department.factory';
import { DepartmentResponseMapper } from './presentation/http/mappers/department-response.mapper';
import { DepartmentsCommandController } from './presentation/http/departments-command.controller';
import { DepartmentsCommandService } from './application/departments-command.service';
import { DepartmentsQueryController } from './presentation/http/departments-query.controller';
import { DepartmentsQueryService } from './application/departments-query.service';
import { DemoMembersQueryService } from './application/demo-members-query.service';
import { DemoMembersCommandService } from './application/demo-members-command.service';
import { DemoMembersCommandController } from './presentation/http/demo-members-command.controller';
import { DemoMembersQueryController } from './presentation/http/demo-members-query.controller';
import { DemoMemberFactory } from './domain/factories/demo-member.factory';
import { DemoMemberResponseMapper } from './presentation/http/mappers/demo-member-response.mapper';

@Module({
  imports: [],
  controllers: [
    DemosCommandController,
    DemosQueryController,
    AdminDemosQueryController,
    DepartmentsCommandController,
    DepartmentsQueryController,
    DemoMembersCommandController,
    DemoMembersQueryController,
  ],
  providers: [
    DemosCommandService,
    DemosQueryService,
    DepartmentsCommandService,
    DepartmentsQueryService,
    DemoMembersCommandService,
    DemoMembersQueryService,
    DemoFactory,
    DepartmentFactory,
    DemoMemberFactory,
    DemoResponseMapper,
    DepartmentResponseMapper,
    DemoMemberResponseMapper,
  ],
  exports: [
    DemosCommandService,
    DemosQueryService,
    DepartmentsCommandService,
    DepartmentsQueryService,
    DemoFactory,
    DepartmentFactory,
    DemoMemberFactory,
    DemoResponseMapper,
    DepartmentResponseMapper,
    DemoMemberResponseMapper,
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
