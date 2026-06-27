import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { DemosCommandController } from './presentation/http/demo/demo-command.controller';
import { DemosQueryController } from './presentation/http/demo/demo-query.controller';
import { DemoFactory } from './domain/factories/demo.factory';

import { DemoResponseMapper } from './presentation/http/mappers/demo-response.mapper';
import { AdminDemosQueryController } from './presentation/http/demo/admin-demo-query.controller';
import { DepartmentFactory } from './domain/factories/department.factory';
import { DepartmentResponseMapper } from './presentation/http/mappers/department-response.mapper';
import { DepartmentsCommandController } from './presentation/http/department/departments-command.controller';
import { DepartmentsQueryController } from './presentation/http/department/departments-query.controller';

import { DemoMembersCommandController } from './presentation/http/demo-member/demo-members-command.controller';
import { DemoMembersQueryController } from './presentation/http/demo-member/demo-members-query.controller';
import { DemoMemberFactory } from './domain/factories/demo-member.factory';
import { DemoMemberResponseMapper } from './presentation/http/mappers/demo-member-response.mapper';
import { DemosCommandService } from './application/demo/demos-command.service';
import { DemosQueryService } from './application/demo/demos-query.service';
import { DepartmentsCommandService } from './application/department/departments-command.service';
import { DepartmentsQueryService } from './application/department/departments-query.service';
import { DemoMembersCommandService } from './application/demo-member/demo-members-command.service';
import { DemoMembersQueryService } from './application/demo-member/demo-members-query.service';
import { DepartmentMembersCommandService } from './application/department-member/department-members-command.service';
import { DepartmentMembersQueryService } from './application/department-member/department-members-query.service';
import { DepartmentMemberFactory } from './domain/factories/department-member.factory';

import { DepartmentMemberResponseMapper } from './presentation/http/mappers/department-member-response.mapper copy';
import { DepartmentMembersQueryController } from './presentation/http/department-member/department-members-query.controller';
import { DepartmentMembersCommandController } from './presentation/http/department-member/department-members-command.controller';

@Global()
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
    DepartmentMembersCommandController,
    DepartmentMembersQueryController,
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
    DepartmentMembersCommandService,
    DepartmentMembersQueryService,
    DepartmentMemberFactory,
    DepartmentMemberResponseMapper,
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
    DepartmentMembersCommandService,
    DepartmentMembersQueryService,
    DepartmentMemberFactory,
    DepartmentMemberResponseMapper,
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
