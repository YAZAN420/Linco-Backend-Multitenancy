import { v7 as uuidv7 } from 'uuid';
import { LiveStreamStatus } from '../enums/live-stream-status.enum';
import { LiveStream } from '../live-stream';

export class LiveStreamFactory {
  createNew(input: {
    title: string;
    description?: string;
    departmentId: string;
    hostId: string;
    scheduledAt?: Date;
    roomName: string;
  }): LiveStream {
    const now = new Date();
    return new LiveStream(uuidv7(), {
      ...input,
      status: LiveStreamStatus.SCHEDULED,
      createdAt: now,
      updatedAt: now,
    });
  }
}
