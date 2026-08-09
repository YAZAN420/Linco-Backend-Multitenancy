import { CursorPageDto } from 'src/common/dtos/pagination';
import { LiveStreamStatus } from 'src/live-streams/domain/enums/live-stream-status.enum';
import { LiveStream } from 'src/live-streams/domain/live-stream';

export interface FindLiveStreamsQuery {
  cursor?: string;
  take: number;
  status?: LiveStreamStatus;
}

export abstract class LiveStreamsQueryRepositoryPort {
  abstract findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream | null>;
  abstract findAll(
    departmentId: string,
    demoId: string,
    query: FindLiveStreamsQuery,
  ): Promise<CursorPageDto<LiveStream>>;
}
