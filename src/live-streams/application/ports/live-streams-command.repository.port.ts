import { LiveStream } from 'src/live-streams/domain/live-stream';

export abstract class LiveStreamsCommandRepository {
  abstract save(liveStream: LiveStream): Promise<void>;
  abstract findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream | null>;
}
