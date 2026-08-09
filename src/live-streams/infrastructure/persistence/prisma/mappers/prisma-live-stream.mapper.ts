import { Injectable } from '@nestjs/common';
import type { LiveStream as PrismaLiveStream } from 'src/generated/prisma/client';
import { LiveStreamStatus } from 'src/live-streams/domain/enums/live-stream-status.enum';
import { LiveStream } from 'src/live-streams/domain/live-stream';

@Injectable()
export class PrismaLiveStreamMapper {
  toDomain(raw: PrismaLiveStream): LiveStream {
    return new LiveStream(raw.id, {
      title: raw.title,
      description: raw.description ?? undefined,
      status: raw.status as LiveStreamStatus,
      roomName: raw.roomName,
      departmentId: raw.departmentId,
      hostId: raw.hostId,
      scheduledAt: raw.scheduledAt ?? undefined,
      startedAt: raw.startedAt ?? undefined,
      endedAt: raw.endedAt ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(entity: LiveStream): PrismaLiveStream {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description ?? null,
      status: entity.status,
      roomName: entity.roomName,
      departmentId: entity.departmentId,
      hostId: entity.hostId,
      scheduledAt: entity.scheduledAt ?? null,
      startedAt: entity.startedAt ?? null,
      endedAt: entity.endedAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
