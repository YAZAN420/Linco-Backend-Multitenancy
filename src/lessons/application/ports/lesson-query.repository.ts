import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindLessonsCursorQuery } from '../interfaces/find-lessons.query';
import { Lesson } from 'src/generated/prisma/browser';

export abstract class LessonQueryRepository {
  abstract findAllCursor(
    sectionId: string,
    options: FindLessonsCursorQuery,
  ): Promise<CursorPageDto<Lesson>>;
  abstract findById(id: string): Promise<Lesson | null>;
}
