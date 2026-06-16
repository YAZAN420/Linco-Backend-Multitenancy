import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindCursorQuery } from '../../../common/interfaces/find.query';
import { Attachment, Lesson } from 'src/generated/prisma/client';

export abstract class LessonQueryRepository {
  abstract findAllCursor(
    sectionId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Lesson>>;
  abstract findById(id: string): Promise<Lesson | null>;
  abstract findAttachmentsCursor(
    lessonId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Attachment>>;
  abstract findAttachmentById(attachmentId: string): Promise<Attachment | null>;
}
