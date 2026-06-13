import { Injectable } from '@nestjs/common';
import type { Attachment as PrismaAttachment } from 'src/generated/prisma/client';
import { Attachment } from 'src/lessons/domain/attachment';
import { FilePath } from 'src/lessons/domain/value-objects/file-path.vo';
import { Title } from 'src/lessons/domain/value-objects/title.vo';

@Injectable()
export class PrismaAttachmentMapper {
  toDomain(raw: PrismaAttachment): Attachment {
    const titleVo = Title.fromPersistence(raw.name);
    const path = FilePath.fromPersistence(raw.path);
    return new Attachment(raw.id, {
      name: titleVo,
      mimeType: raw.mimeType,
      path: path,
      lessonId: raw.lessonId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(lesson: Attachment): PrismaAttachment {
    return {
      id: lesson.id,
      name: lesson.name,
      mimeType: lesson.mimeType,
      path: lesson.path,
      lessonId: lesson.lessonId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
