import { Injectable } from '@nestjs/common';
import { DepartmentMessageResponseDto } from '../dto/departmentMessage-response.dto';
import { DepartmentMessageWithSenderAndReply } from 'src/core/database/prisma/types';
import { MessageType } from 'src/departmentMessages/domain/enums/message-type.enum';

@Injectable()
export class DepartmentMessageResponseMapper {
  toResponseFromPrisma(
    message: DepartmentMessageWithSenderAndReply,
  ): DepartmentMessageResponseDto {
    const user = message.sender.demoMember.user;

    const hasAttachment =
      !message.isDeleted &&
      message.fileUrl &&
      message.fileName &&
      message.mimeType &&
      message.fileSize !== null;

    const attachment = hasAttachment
      ? {
          fileUrl: message.fileUrl!,
          fileName: message.fileName!,
          mimeType: message.mimeType!,
          fileSize: message.fileSize!,
        }
      : undefined;

    const content = message.isDeleted
      ? undefined
      : (message.content ?? undefined);

    return new DepartmentMessageResponseDto(
      message.id,
      message.departmentId,
      message.type as MessageType,
      content,
      message.isEdited,
      message.isDeleted,
      message.createdAt,
      message.updatedAt,
      {
        id: message.sender.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imagePath: user.imagePath,
      },
      attachment,
      message.replyTo
        ? {
            id: message.replyTo.id,
            content: message.replyTo.content,
            type: message.replyTo.type,
          }
        : undefined,
    );
  }

  toResponseManyFromPrisma(
    messages: DepartmentMessageWithSenderAndReply[],
  ): DepartmentMessageResponseDto[] {
    return messages.map((msg) => this.toResponseFromPrisma(msg));
  }
}
