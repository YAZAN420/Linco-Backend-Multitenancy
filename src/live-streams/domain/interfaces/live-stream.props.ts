import { LiveStreamStatus } from '../enums/live-stream-status.enum';

export interface LiveStreamProps {
  title: string;
  description?: string;
  status: LiveStreamStatus;
  roomName: string;
  departmentId: string;
  hostId: string;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
