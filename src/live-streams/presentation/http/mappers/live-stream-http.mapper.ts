import { Injectable } from '@nestjs/common';
import { LiveStream } from 'src/live-streams/domain/live-stream';

@Injectable()
export class LiveStreamHttpMapper {
  toResponse(stream: LiveStream) {
    return {
      id: stream.id,
      title: stream.title,
      description: stream.description,
      status: stream.status,
      roomName: stream.roomName,
      departmentId: stream.departmentId,
      hostId: stream.hostId,
      scheduledAt: stream.scheduledAt,
      startedAt: stream.startedAt,
      endedAt: stream.endedAt,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    };
  }
  toResponseMany(streams: LiveStream[]) {
    return streams.map((stream) => this.toResponse(stream));
  }
}
