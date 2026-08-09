import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination';
import { LiveStream } from '../domain/live-stream';
import {
  FindLiveStreamsQuery,
  LiveStreamsQueryRepositoryPort,
} from './ports/live-streams-query.repository.port';

@Injectable()
export class LiveStreamsQueryService {
  constructor(private readonly repository: LiveStreamsQueryRepositoryPort) {}
  async findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream> {
    const stream = await this.repository.findById(id, departmentId, demoId);
    if (!stream) throw new NotFoundException('errors.LIVE_STREAM_NOT_FOUND');
    return stream;
  }
  findAll(
    departmentId: string,
    demoId: string,
    query: FindLiveStreamsQuery,
  ): Promise<CursorPageDto<LiveStream>> {
    return this.repository.findAll(departmentId, demoId, query);
  }
}
