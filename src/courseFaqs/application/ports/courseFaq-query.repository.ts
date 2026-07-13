import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindCourseFaqsCursorQuery } from '../interfaces/find-courseFaqs.query';
import { CourseFaq } from 'src/generated/prisma/client';

export abstract class CourseFaqQueryRepository {
  abstract findAllCursor(
    courseId: string,
    options: FindCourseFaqsCursorQuery,
  ): Promise<CursorPageDto<CourseFaq>>;
  abstract findById(id: string): Promise<CourseFaq | null>;
}
