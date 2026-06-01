import { Module } from '@nestjs/common';
import { DemoCommandRepository } from 'src/demos/application/ports/demo-command.repository';
import { PrismaDemoCommandRepository } from './repositories/prisma-demo-command.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';
import { PrismaDemoQueryRepository } from './repositories/prisma-demo-query.repository';
import { PrismaDemoMapper } from './mappers/prisma-demo.mapper';
import { PrismaDepartmentMapper } from './mappers/prisma-department.mapper';

@Module({
  providers: [
    PrismaDemoMapper,
    PrismaDepartmentMapper,
    {
      provide: DemoCommandRepository,
      useClass: PrismaDemoCommandRepository,
    },
    {
      provide: DemoQueryRepository,
      useClass: PrismaDemoQueryRepository,
    },
  ],
  exports: [DemoCommandRepository, DemoQueryRepository],
})
export class PrismaPersistenceModule {}
