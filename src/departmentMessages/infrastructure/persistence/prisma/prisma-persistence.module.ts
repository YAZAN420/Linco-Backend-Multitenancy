import { Module } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from 'src/departmentMessages/application/ports/departmentMessage-command.repository';
import { PrismaDepartmentMessageCommandRepository } from './repositories/prisma-departmentMessage-command.repository';
import { DepartmentMessageQueryRepository } from 'src/departmentMessages/application/ports/departmentMessage-query.repository';
import { PrismaDepartmentMessageQueryRepository } from './repositories/prisma-departmentMessage-query.repository';
import { PrismaDepartmentMessageMapper } from './mappers/prisma-departmentMessage.mapper';

@Module({
  providers: [
    PrismaDepartmentMessageMapper,
    {
      provide: DepartmentMessageCommandRepository,
      useClass: PrismaDepartmentMessageCommandRepository,
    },
    {
      provide: DepartmentMessageQueryRepository,
      useClass: PrismaDepartmentMessageQueryRepository,
    },
  ],
  exports: [
    DepartmentMessageCommandRepository,
    DepartmentMessageQueryRepository,
  ],
})
export class PrismaPersistenceModule {}
