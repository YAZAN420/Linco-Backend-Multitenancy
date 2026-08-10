import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { LiveStreamStatus } from '../enums/live-stream-status.enum';
import { LiveStream } from '../live-stream';

@Injectable()
export class LiveStreamFactory {
  createNew(
    title: string,
    departmentId: string,
    hostId: string,
    roomName: string,
    description?: string,
    scheduledAt?: Date,
  ): LiveStream {
    const now = new Date();
    return new LiveStream(uuidv7(), {
      title,
      description,
      departmentId,
      hostId,
      scheduledAt,
      roomName,
      status: LiveStreamStatus.SCHEDULED,
      createdAt: now,
      updatedAt: now,
    });
  }
}
