import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { DemosCommandController } from './presentation/http/demo/demo-command.controller';
import { DemosQueryController } from './presentation/http/demo/demo-query.controller';
import { DemoFactory } from './domain/factories/demo.factory';

import { DemoResponseMapper } from './presentation/http/mappers/demo-response.mapper';

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
import { DemoEventsListener } from './presentation/events/demo.listener';
import { DemosCron } from './presentation/cron/demos.cron';
import { InvitationsCommandController } from './presentation/http/invitation/invitations-command.controller';
import { InvitationsQueryController } from './presentation/http/invitation/invitations-query.controller';
import { InvitationsCommandService } from './application/invitation/invitations-command.service';
import { InvitationsQueryService } from './application/invitation/invitations-query.service';
import { InvitationFactory } from './domain/factories/invitation.factory';
import { InvitationResponseMapper } from './presentation/http/mappers/invitation-response.mapper';
import { UsersModule } from 'src/users/users.module';

import { NotificationsModule } from 'src/notifications/notifications.module';

@Global()
@Module({
  imports: [UsersModule, NotificationsModule],
  controllers: [
    DemosCommandController,
    DemosQueryController,
    DepartmentsCommandController,
    DepartmentsQueryController,
    DemoMembersCommandController,
    DemoMembersQueryController,
    DepartmentMembersCommandController,
    DepartmentMembersQueryController,
    InvitationsCommandController,
    InvitationsQueryController,
  ],
  providers: [
    DemosCron,
    DemoEventsListener,
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
    InvitationsCommandService,
    InvitationsQueryService,
    InvitationFactory,
    InvitationResponseMapper,
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
    InvitationsCommandService,
    InvitationsQueryService,
    InvitationFactory,
    InvitationResponseMapper,
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
