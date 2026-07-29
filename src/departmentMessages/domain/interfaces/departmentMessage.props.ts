import { MessageType } from '../enums/message-type.enum';

export interface DepartmentMessageProps {
  departmentId: string;
  senderId: string;
  type: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  replyToId?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
