import { Module } from '@nestjs/common';
import { AssetCommandRepository } from 'src/assets/application/ports/asset-command.repository';
import { PrismaAssetCommandRepository } from './repositories/prisma-asset-command.repository';
import { AssetQueryRepository } from 'src/assets/application/ports/asset-query.repository';
import { PrismaAssetQueryRepository } from './repositories/prisma-asset-query.repository';
import { PrismaAssetMapper } from './mappers/prisma-asset.mapper';

@Module({
  providers: [
    PrismaAssetMapper,
    {
      provide: AssetCommandRepository,
      useClass: PrismaAssetCommandRepository,
    },
    {
      provide: AssetQueryRepository,
      useClass: PrismaAssetQueryRepository,
    },
  ],
  exports: [AssetCommandRepository, AssetQueryRepository],
})
export class PrismaPersistenceModule {}
