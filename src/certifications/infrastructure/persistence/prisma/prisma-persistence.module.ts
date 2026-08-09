import { Module } from '@nestjs/common';
import { CertificationCommandRepository } from 'src/certifications/application/ports/certification-command.repository';
import { CertificationQueryRepository } from 'src/certifications/application/ports/certification-query.repository';
import { PrismaCertificationMapper } from './mappers/prisma-certification.mapper';
import { PrismaCertificationCommandRepository } from './repositories/prisma-certification-command.repository';
import { PrismaCertificationQueryRepository } from './repositories/prisma-certification-query.repository';

@Module({
  providers: [
    PrismaCertificationMapper,
    {
      provide: CertificationCommandRepository,
      useClass: PrismaCertificationCommandRepository,
    },
    {
      provide: CertificationQueryRepository,
      useClass: PrismaCertificationQueryRepository,
    },
  ],
  exports: [CertificationCommandRepository, CertificationQueryRepository],
})
export class PrismaPersistenceModule {}
