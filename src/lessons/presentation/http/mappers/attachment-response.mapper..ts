import { Injectable } from '@nestjs/common';
import { Attachment as PrismaAttachment } from 'src/generated/prisma/browser';
import { Attachment as DomainAttachment } from 'src/lessons/domain/attachment';
import { AttachmentResponseDto } from '../dto/attachment-response.dto';

@Injectable()
export class AttachmentResponseMapper {
  toResponseFromPrisma(lesson: PrismaAttachment): AttachmentResponseDto {
    return new AttachmentResponseDto(
      lesson.id,
      lesson.name,
      lesson.path,
      lesson.mimeType,
      lesson.lessonId,
      lesson.createdAt,
      lesson.updatedAt,
    );
  }

  toResponseFromDomain(lesson: DomainAttachment): AttachmentResponseDto {
    return new AttachmentResponseDto(
      lesson.id,
      lesson.name,
      lesson.path,
      lesson.mimeType,
      lesson.lessonId,
      lesson.createdAt,
      lesson.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    lessons: PrismaAttachment[],
  ): AttachmentResponseDto[] {
    return lessons.map((lesson) => this.toResponseFromPrisma(lesson));
  }
}
