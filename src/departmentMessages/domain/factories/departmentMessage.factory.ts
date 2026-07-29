import { Injectable } from '@nestjs/common';
import { DepartmentMessage } from '../departmentMessage';
import { MessageType } from '../enums/message-type.enum';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class DepartmentMessageFactory {
  public createNew(
    departmentId: string,
    senderId: string,
    type?: MessageType,
    content?: string,
    fileUrl?: string,
    fileName?: string,
    mimeType?: string,
    fileSize?: number,
    replyToId?: string,
  ): DepartmentMessage {
    const now = new Date();
    return new DepartmentMessage(uuidv7(), {
      departmentId: departmentId,
      senderId: senderId,
      type: type ?? MessageType.TEXT,
      content: content,
      fileUrl: fileUrl,
      fileName: fileName,
      mimeType: mimeType,
      fileSize: fileSize,
      replyToId: replyToId,
      isEdited: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    });
  }
}
