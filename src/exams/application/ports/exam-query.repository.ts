import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindExamsCursorQuery,
  FindExamsQuery,
} from '../interfaces/find-exams.query';
import { Exam } from 'src/exams/domain/exam';

export abstract class ExamQueryRepository {
  abstract findAll(options: FindExamsQuery): Promise<PageDto<Exam>>;
  abstract findAllCursor(
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>>;
  abstract findById(id: string): Promise<Exam | null>;
}
