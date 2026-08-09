import { LiveStream } from 'src/live-streams/domain/live-stream';

export abstract class LiveStreamsCommandRepositoryPort {
  abstract save(liveStream: LiveStream): Promise<void>;
  abstract findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream | null>;
  abstract departmentBelongsToDemo(
    departmentId: string,
    demoId: string,
  ): Promise<boolean>;
  abstract hostBelongsToDepartment(
    hostId: string,
    departmentId: string,
    demoId: string,
  ): Promise<boolean>;
  abstract roomNameExists(roomName: string): Promise<boolean>;
}
