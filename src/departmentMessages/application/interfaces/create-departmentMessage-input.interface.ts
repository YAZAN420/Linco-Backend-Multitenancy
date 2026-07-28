import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

export interface CreateDepartmentMessageInput {
  departmentId: string;
  senderId: string;
  type?: MessageType;
  content?: string;
  blobName?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  replyToId?: string;
}
