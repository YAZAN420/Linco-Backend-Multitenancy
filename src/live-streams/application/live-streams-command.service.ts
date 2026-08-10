import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { LiveStreamFactory } from '../domain/factories/live-stream.factory';
import { LiveStream } from '../domain/live-stream';
import { CreateLiveStreamInput } from './interfaces/create-live-stream.interface';
import { EndLiveStreamInput } from './interfaces/end-live-stream.interface';
import { GenerateLiveStreamTokenInput } from './interfaces/generate-live-stream-token.interface';
import { StartLiveStreamInput } from './interfaces/start-live-stream.interface';
import { JitsiTokenPort } from './ports/jitsi-token.port';
import { JitsiParticipantRole } from './interfaces/jitsi-participant-role.enum';
import { JitsiTokenResult } from './interfaces/jitsi-token-result.interface';
import { LiveStreamsCommandRepository } from './ports/live-streams-command.repository.port';
import { UpdateLiveStreamInput } from './interfaces/update-live-stream.interface';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Injectable()
export class LiveStreamsCommandService {
  constructor(
    private readonly repository: LiveStreamsCommandRepository,
    private readonly factory: LiveStreamFactory,
    private readonly jitsiTokenPort: JitsiTokenPort,
  ) {}

  async create(
    demoId: string,
    departmentId: string,
    hostId: string,
    input: CreateLiveStreamInput,
  ): Promise<LiveStream> {
    const roomName = `live-${uuidv7()}`;

    const stream = this.factory.createNew(
      input.title,
      departmentId,
      hostId,
      roomName,
      input.description,
      input.scheduledAt,
    );

    await this.repository.save(stream);
    return stream;
  }

  async update(
    demoId: string,
    departmentId: string,
    id: string,
    input: UpdateLiveStreamInput,
  ): Promise<LiveStream> {
    const stream = await this.findById(id, departmentId, demoId);

    if (input.title !== undefined) {
      stream.updateTitle(input.title);
    }
    if (input.description !== undefined) {
      stream.updateDescription(input.description);
    }
    if (input.scheduledAt !== undefined) {
      stream.updateScheduledAt(input.scheduledAt);
    }

    await this.repository.save(stream);
    return stream;
  }

  async start(input: StartLiveStreamInput): Promise<LiveStream> {
    const stream = await this.findById(
      input.liveStreamId,
      input.departmentId,
      input.demoId,
    );
    this.assertHostOrManager(
      stream,
      input.departmentMemberId,
      input.isDepartmentManager,
    );
    stream.start();
    await this.repository.save(stream);
    return stream;
  }

  async end(input: EndLiveStreamInput): Promise<LiveStream> {
    const stream = await this.findById(
      input.liveStreamId,
      input.departmentId,
      input.demoId,
    );
    this.assertHostOrManager(
      stream,
      input.departmentMemberId,
      input.isDepartmentManager,
    );
    stream.end();
    await this.repository.save(stream);
    return stream;
  }

  async generateToken(
    user: ActiveUserData,
    input: GenerateLiveStreamTokenInput,
  ): Promise<JitsiTokenResult> {
    const stream = await this.findById(
      input.liveStreamId,
      input.departmentId,
      input.demoId,
    );
    stream.ensureJoinable();
    const role =
      stream.hostId === input.departmentMemberId
        ? JitsiParticipantRole.HOST
        : JitsiParticipantRole.PARTICIPANT;
    return this.jitsiTokenPort.generateToken({
      roomName: stream.roomName,
      user,
      role,
    });
  }

  private async findById(
    id: string,
    departmentId: string,
    demoId: string,
  ): Promise<LiveStream> {
    const stream = await this.repository.findById(id, departmentId, demoId);
    if (!stream) throw new NotFoundException('errors.LIVE_STREAM_NOT_FOUND');
    return stream;
  }

  private assertHostOrManager(
    stream: LiveStream,
    memberId: string,
    isManager: boolean,
  ): void {
    if (stream.hostId !== memberId && !isManager)
      throw new ForbiddenException(
        'errors.INSUFFICIENT_DEPARTMENT_PERMISSIONS',
      );
  }
}
