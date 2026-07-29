import { Injectable } from '@nestjs/common';
import type { DepartmentMessage as PrismaDepartmentMessage } from 'src/generated/prisma/client';

import { DepartmentMessage } from 'src/departmentMessages/domain/departmentMessage';
import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

@Injectable()
export class PrismaDepartmentMessageMapper {
  toDomain(raw: PrismaDepartmentMessage): DepartmentMessage {
    return new DepartmentMessage(raw.id, {
      departmentId: raw.departmentId,
      senderId: raw.senderId,
      type: raw.type as unknown as MessageType,
      content: raw.content ?? undefined,
      fileUrl: raw.fileUrl ?? undefined,
      fileName: raw.fileName ?? undefined,
      mimeType: raw.mimeType ?? undefined,
      fileSize: raw.fileSize ?? undefined,
      replyToId: raw.replyToId ?? undefined,
      isEdited: raw.isEdited,
      isDeleted: raw.isDeleted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(departmentMessage: DepartmentMessage): PrismaDepartmentMessage {
    return {
      id: departmentMessage.id,
      departmentId: departmentMessage.departmentId,
      senderId: departmentMessage.senderId,
      type: departmentMessage.type,
      content: departmentMessage.content ?? null,
      fileUrl: departmentMessage.fileUrl ?? null,
      fileName: departmentMessage.fileName ?? null,
      mimeType: departmentMessage.mimeType ?? null,
      fileSize: departmentMessage.fileSize ?? null,
      replyToId: departmentMessage.replyToId ?? null,
      isEdited: departmentMessage.isEdited,
      isDeleted: departmentMessage.isDeleted,
      createdAt: departmentMessage.createdAt,
      updatedAt: departmentMessage.updatedAt,
    };
  }
}
