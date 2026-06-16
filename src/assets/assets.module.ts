import { DynamicModule, Module, Type } from '@nestjs/common';
import { AssetsCommandController } from './presentation/http/assets-command.controller';
import { AssetsQueryController } from './presentation/http/assets-query.controller';
import { AssetFactory } from './domain/factories/asset.factory';
import { AssetsCommandService } from './application/assets-command.service';
import { AssetsQueryService } from './application/assets-query.service';
import { AssetResponseMapper } from './presentation/http/mappers/asset-response.mapper';
import { AssetsEventListener } from './application/listeners/assets-event.listener';

@Module({
  imports: [],
  controllers: [AssetsCommandController, AssetsQueryController],
  providers: [
    AssetsCommandService,
    AssetsQueryService,
    AssetFactory,
    AssetResponseMapper,
    AssetsEventListener,
  ],
  exports: [
    AssetsCommandService,
    AssetsQueryService,
    AssetFactory,
    AssetResponseMapper,
    AssetsEventListener,
  ],
})
export class AssetsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: AssetsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
