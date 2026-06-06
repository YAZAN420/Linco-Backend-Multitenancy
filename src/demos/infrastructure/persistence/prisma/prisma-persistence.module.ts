import { Module } from '@nestjs/common';
import { DemoCommandRepository } from 'src/demos/application/ports/demo-command.repository';
import { PrismaDemoCommandRepository } from './repositories/prisma-demo-command.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';
import { PrismaDemoQueryRepository } from './repositories/prisma-demo-query.repository';
import { PrismaDemoMapper } from './mappers/prisma-demo.mapper';
import { PrismaDepartmentMapper } from './mappers/prisma-department.mapper';
import { PrismaDemoMemberCommandRepository } from './repositories/prisma-demo-member-command.repository';
import { PrismaDemoMemberQueryRepository } from './repositories/prisma-demo-member-query.repository';
import { DemoMemberCommandRepository } from 'src/demos/application/ports/demo-member-command.repository';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member-query.repository';
import { PrismaDemoMemberMapper } from './mappers/prisma-demo-member.mapper';

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
