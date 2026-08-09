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
import {
  JitsiParticipantRole,
  JitsiTokenPort,
  JitsiTokenResult,
} from './ports/jitsi-token.port';
import { LiveStreamsCommandRepositoryPort } from './ports/live-streams-command.repository.port';

@Injectable()
export class LiveStreamsCommandService {
  constructor(
    private readonly repository: LiveStreamsCommandRepositoryPort,
    private readonly factory: LiveStreamFactory,
    private readonly jitsiTokenPort: JitsiTokenPort,
  ) {}

  async create(
    demoId: string,
    departmentId: string,
    hostId: string,
    input: CreateLiveStreamInput,
  ): Promise<LiveStream> {
    await this.validateOwnership(demoId, departmentId, hostId);
    let roomName: string;
    do {
      roomName = `live-${uuidv7()}`;
    } while (await this.repository.roomNameExists(roomName));
    const stream = this.factory.createNew({
      ...input,
      departmentId,
      hostId,
      roomName,
    });
    await this.repository.save(stream);
    return stream;
  }

  async update(
    demoId: string,
    departmentId: string,
    id: string,
    input: { title?: string; description?: string; scheduledAt?: Date },
  ): Promise<LiveStream> {
    const stream = await this.findById(id, departmentId, demoId);
    stream.update(input);
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
      userId: input.userId,
      role,
    });
  }

  private async validateOwnership(
    demoId: string,
    departmentId: string,
    hostId: string,
  ): Promise<void> {
    if (!(await this.repository.departmentBelongsToDemo(departmentId, demoId)))
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    if (
      !(await this.repository.hostBelongsToDepartment(
        hostId,
        departmentId,
        demoId,
      ))
    )
      throw new ForbiddenException('errors.HOST_DOES_NOT_BELONG_TO_DEPARTMENT');
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
