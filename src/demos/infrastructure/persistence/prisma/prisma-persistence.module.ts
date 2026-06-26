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

@Module({
  providers: [
    PrismaDemoMapper,
    PrismaDepartmentMapper,
    PrismaDemoMemberMapper,
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
  ],
  exports: [
    DemoCommandRepository,
    DemoQueryRepository,
    DemoMemberCommandRepository,
    DemoMemberQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
