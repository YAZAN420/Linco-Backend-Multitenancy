import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { LiveStreamsCommandRepository } from 'src/live-streams/application/ports/live-streams-command.repository.port';
import { LiveStream } from 'src/live-streams/domain/live-stream';
import { PrismaLiveStreamMapper } from '../mappers/prisma-live-stream.mapper';

@Injectable()
export class PrismaLiveStreamCommandRepository implements LiveStreamsCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaLiveStreamMapper,
  ) {}

  async save(stream: LiveStream): Promise<void> {
    const data = this.mapper.toPersistence(stream);
    try {
      await this.prisma.liveStream.upsert({
        where: { id: stream.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('errors.LIVE_STREAM_ROOM_ALREADY_EXISTS');
      }
      throw new InternalServerErrorException(
        'errors.DATABASE_OPERATION_FAILED_ERROR',
      );
    }
  }

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
}
