import { Injectable } from '@nestjs/common';
import { Attachment as PrismaAttachment } from 'src/generated/prisma/client';
import { Attachment as DomainAttachment } from 'src/lessons/domain/attachment';
import { AttachmentResponseDto } from '../dto/attachment-response.dto';

@Injectable()
export class AttachmentResponseMapper {
  toResponseFromPrisma(attachment: PrismaAttachment): AttachmentResponseDto {
    return new AttachmentResponseDto(
      attachment.id,
      attachment.name,
      attachment.path,
      attachment.mimeType,
      attachment.lessonId,
      attachment.createdAt,
      attachment.updatedAt,
    );
  }

  toResponseFromDomain(attachment: DomainAttachment): AttachmentResponseDto {
    return new AttachmentResponseDto(
      attachment.id,
      attachment.name,
      attachment.path,
      attachment.mimeType,
      attachment.lessonId,
      attachment.createdAt,
      attachment.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    lessons: PrismaAttachment[],
  ): AttachmentResponseDto[] {
    return lessons.map((lesson) => this.toResponseFromPrisma(lesson));
  }
}
