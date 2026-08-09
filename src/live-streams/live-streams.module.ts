import { DynamicModule, Module, Type } from '@nestjs/common';
import { LiveStreamsCommandService } from './application/live-streams-command.service';
import { LiveStreamsQueryService } from './application/live-streams-query.service';
import { LiveStreamFactory } from './domain/factories/live-stream.factory';
import { LiveStreamsCommandController } from './presentation/http/live-streams-command.controller';
import { LiveStreamsQueryController } from './presentation/http/live-streams-query.controller';
import { LiveStreamHttpMapper } from './presentation/http/mappers/live-stream-http.mapper';

@Module({
  controllers: [LiveStreamsCommandController, LiveStreamsQueryController],
  providers: [
    LiveStreamsCommandService,
    LiveStreamsQueryService,
    LiveStreamFactory,
    LiveStreamHttpMapper,
  ],
  exports: [LiveStreamsCommandService, LiveStreamsQueryService],
})
export class LiveStreamsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: LiveStreamsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
