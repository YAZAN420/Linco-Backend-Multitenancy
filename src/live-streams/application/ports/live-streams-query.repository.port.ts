import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { LiveStream } from 'src/live-streams/domain/live-stream';

export abstract class LiveStreamsQueryRepository {
  abstract findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream | null>;
  abstract findAll(
    departmentId: string,
    demoId: string,
    query: FindCursorQuery,
  ): Promise<CursorPageDto<LiveStream>>;
}
