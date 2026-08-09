import { Module } from '@nestjs/common';
import { LiveStreamsCommandRepositoryPort } from 'src/live-streams/application/ports/live-streams-command.repository.port';
import { LiveStreamsQueryRepositoryPort } from 'src/live-streams/application/ports/live-streams-query.repository.port';
import { PrismaLiveStreamMapper } from './mappers/prisma-live-stream.mapper';
import { PrismaLiveStreamCommandRepository } from './repositories/prisma-live-stream-command.repository';
import { PrismaLiveStreamQueryRepository } from './repositories/prisma-live-stream-query.repository';

@Module({
  providers: [
    PrismaLiveStreamMapper,
    {
      provide: LiveStreamsCommandRepositoryPort,
      useClass: PrismaLiveStreamCommandRepository,
    },
    {
      provide: LiveStreamsQueryRepositoryPort,
      useClass: PrismaLiveStreamQueryRepository,
    },
  ],
  exports: [LiveStreamsCommandRepositoryPort, LiveStreamsQueryRepositoryPort],
})
export class PrismaPersistenceModule {}
