import { Injectable } from '@nestjs/common';
import { CursorPageDto, CursorPageMetaDto } from 'src/common/dtos/pagination';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  FindLiveStreamsQuery,
  LiveStreamsQueryRepository,
} from 'src/live-streams/application/ports/live-streams-query.repository.port';
import { LiveStream } from 'src/live-streams/domain/live-stream';
import { PrismaLiveStreamMapper } from '../mappers/prisma-live-stream.mapper';

@Injectable()
export class PrismaLiveStreamQueryRepository implements LiveStreamsQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaLiveStreamMapper,
  ) {}

  async findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream | null> {
    const raw = await this.prisma.liveStream.findFirst({
      where: { id, departmentId, department: { demoId } },
    });
    return raw ? this.mapper.toDomain(raw) : null;
  }

  async findAll(
    departmentId: string,
    demoId: string,
    query: FindLiveStreamsQuery,
  ): Promise<CursorPageDto<LiveStream>> {
    const items = await this.prisma.liveStream.findMany({
      take: query.take + 1,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      where: { departmentId, department: { demoId }, status: query.status },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
    const hasNextPage = items.length > query.take;
    if (hasNextPage) items.pop();
    const endCursor = items.length ? items[items.length - 1].id : null;
    return new CursorPageDto(
      items.map((item) => this.mapper.toDomain(item)),
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }
}
