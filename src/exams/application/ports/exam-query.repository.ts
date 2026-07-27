import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindExamsCursorQuery } from '../interfaces/find-exams.query';
import { Exam } from 'src/exams/domain/exam';

export abstract class ExamQueryRepository {
  abstract findAllCursor(
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>>;
  abstract findById(id: string): Promise<Exam | null>;
}
