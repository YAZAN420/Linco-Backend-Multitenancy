import { Module } from '@nestjs/common';
import { DemoCommandRepository } from 'src/demos/application/ports/demo/demo-command.repository';
import { PrismaDemoQueryRepository } from './repositories/demo/prisma-demo-query.repository';
import { PrismaDemoMapper } from './mappers/prisma-demo.mapper';
import { PrismaDepartmentMapper } from './mappers/prisma-department.mapper';

import { PrismaDemoMemberQueryRepository } from './repositories/demo-member/prisma-demo-member-query.repository';
import { DemoMemberCommandRepository } from 'src/demos/application/ports/demo-member/demo-member-command.repository';
import { PrismaDemoMemberMapper } from './mappers/prisma-demo-member.mapper';
import { PrismaDemoCommandRepository } from './repositories/demo/prisma-demo-command.repository';
import { PrismaDemoMemberCommandRepository } from './repositories/demo-member/prisma-demo-member-command.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member/demo-member-query.repository';
import { DepartmentMemberQueryRepository } from 'src/demos/application/ports/department-member/department-member-query.repository';
import { PrismaDepartmentMemberQueryRepository } from './repositories/department-member/prisma-department-member-query.repository';
import { DepartmentMemberCommandRepository } from 'src/demos/application/ports/department-member/department-member-command.repository';
import { PrismaDepartmentMemberCommandRepository } from './repositories/department-member/prisma-department-member-command.repository';
import { PrismaDepartmentMemberMapper } from './mappers/prisma-department-member.mapper';
import { InvitationCommandRepository } from 'src/demos/application/ports/invitation/invitation-command.repository';
import { PrismaInvitationCommandRepository } from './repositories/invitation/prisma-invitation-command.repository';
import { InvitationQueryRepository } from 'src/demos/application/ports/invitation/invitation-query.repository';
import { PrismaInvitationQueryRepository } from './repositories/invitation/prisma-invitation-query.repository';
import { PrismaInvitationMapper } from './mappers/prisma-invitation.mapper';

@Module({
  providers: [
    PrismaDemoMapper,
    PrismaDepartmentMapper,
    PrismaDemoMemberMapper,
    PrismaDepartmentMemberMapper,
    PrismaInvitationMapper,
    {
      provide: DemoCommandRepository,
      useClass: PrismaDemoCommandRepository,
    },
    {
      provide: DemoQueryRepository,
      useClass: PrismaDemoQueryRepository,
    },
    {
      provide: DemoMemberCommandRepository,
      useClass: PrismaDemoMemberCommandRepository,
    },
    {
      provide: DemoMemberQueryRepository,
      useClass: PrismaDemoMemberQueryRepository,
    },
    {
      provide: DepartmentMemberQueryRepository,
      useClass: PrismaDepartmentMemberQueryRepository,
    },
    {
      provide: DepartmentMemberCommandRepository,
      useClass: PrismaDepartmentMemberCommandRepository,
    },
    {
      provide: InvitationCommandRepository,
      useClass: PrismaInvitationCommandRepository,
    },
    {
      provide: InvitationQueryRepository,
      useClass: PrismaInvitationQueryRepository,
    },
  ],
  exports: [
    DemoCommandRepository,
    DemoQueryRepository,
    DemoMemberCommandRepository,
    DemoMemberQueryRepository,
    DepartmentMemberQueryRepository,
    DepartmentMemberCommandRepository,
    InvitationCommandRepository,
    InvitationQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
