import { Injectable } from '@nestjs/common';
import { DepartmentMessageResponseDto } from '../dto/departmentMessage-response.dto';
import { DepartmentMessageWithSenderAndReply } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentMessageResponseMapper {
  toResponseFromPrisma(
    message: DepartmentMessageWithSenderAndReply,
  ): DepartmentMessageResponseDto {
    const user = message.sender?.demoMember?.user;

    return new DepartmentMessageResponseDto(
      message.id,
      message.departmentId,
      message.senderId,
      message.type,
      message.content ?? undefined,
      message.blobName ?? undefined,
      message.fileName ?? undefined,
      message.mimeType ?? undefined,
      message.fileSize ?? undefined,
      message.replyToId ?? undefined,
      message.isEdited,
      message.isDeleted,
      message.createdAt,
      message.updatedAt,
      user
        ? {
            id: message.sender.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imagePath: user.imagePath,
          }
        : undefined,
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
