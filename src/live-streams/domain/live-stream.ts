import { DomainException } from 'src/common/exceptions/domain.exception';
import { LiveStreamStatus } from './enums/live-stream-status.enum';
import { LiveStreamProps } from './interfaces/live-stream.props';

export class LiveStream {
  constructor(
    public readonly id: string,
    private readonly props: LiveStreamProps,
  ) {}

  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get status() {
    return this.props.status;
  }
  get roomName() {
    return this.props.roomName;
  }
  get departmentId() {
    return this.props.departmentId;
  }
  get hostId() {
    return this.props.hostId;
  }
  get scheduledAt() {
    return this.props.scheduledAt;
  }
  get startedAt() {
    return this.props.startedAt;
  }
  get endedAt() {
    return this.props.endedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  updateTitle(newTitle: string): void {
    this.ensureIsScheduled();
    if (this.props.title === newTitle) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateDescription(newDescription?: string): void {
    this.ensureIsScheduled();
    if (this.props.description === newDescription) return;
    this.props.description = newDescription;
    this.touch();
  }

  updateScheduledAt(newScheduledAt?: Date): void {
    this.ensureIsScheduled();
    if (this.props.scheduledAt?.getTime() === newScheduledAt?.getTime()) return;
    this.props.scheduledAt = newScheduledAt;
    this.touch();
  }

  start(now = new Date()): void {
    if (this.props.status !== LiveStreamStatus.SCHEDULED) {
      throw new DomainException('errors.LIVE_STREAM_CANNOT_BE_STARTED');
    }
    this.props.status = LiveStreamStatus.LIVE;
    this.props.startedAt = now;
    this.touch(now);
  }

  end(now = new Date()): void {
    if (this.props.status !== LiveStreamStatus.LIVE) {
      throw new DomainException('errors.LIVE_STREAM_CANNOT_BE_ENDED');
    }
    this.props.status = LiveStreamStatus.ENDED;
    this.props.endedAt = now;
    this.touch(now);
  }

  ensureJoinable(): void {
    if (this.props.status !== LiveStreamStatus.LIVE) {
      throw new DomainException('errors.LIVE_STREAM_CANNOT_BE_JOINED');
    }
  }
  private ensureIsScheduled(): void {
    if (this.props.status !== LiveStreamStatus.SCHEDULED) {
      throw new DomainException(
        'errors.ONLY_SCHEDULED_LIVE_STREAMS_CAN_BE_UPDATED',
      );
    }
  }

  private touch(now = new Date()): void {
    this.props.updatedAt = now;
  }
}
