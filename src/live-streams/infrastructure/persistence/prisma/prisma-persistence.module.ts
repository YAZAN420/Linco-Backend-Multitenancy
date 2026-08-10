import { Module } from '@nestjs/common';
import { LiveStreamsCommandRepository } from 'src/live-streams/application/ports/live-streams-command.repository.port';
import { LiveStreamsQueryRepository } from 'src/live-streams/application/ports/live-streams-query.repository.port';
import { PrismaLiveStreamMapper } from './mappers/prisma-live-stream.mapper';
import { PrismaLiveStreamCommandRepository } from './repositories/prisma-live-stream-command.repository';
import { PrismaLiveStreamQueryRepository } from './repositories/prisma-live-stream-query.repository';

@Module({
  providers: [
    PrismaLiveStreamMapper,
    {
      provide: LiveStreamsCommandRepository,
      useClass: PrismaLiveStreamCommandRepository,
    },
    {
      provide: LiveStreamsQueryRepository,
      useClass: PrismaLiveStreamQueryRepository,
    },
  ],
  exports: [LiveStreamsCommandRepository, LiveStreamsQueryRepository],
})
export class PrismaPersistenceModule {}
