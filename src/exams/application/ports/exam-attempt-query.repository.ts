import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindExamAttemptsCursorQuery,
  FindExamAttemptsQuery,
} from '../interfaces/find-exam-attempts.query';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';

export abstract class ExamAttemptQueryRepository {
  abstract findAll(
    courseId: string,
    options: FindExamAttemptsQuery,
  ): Promise<PageDto<ExamAttempt>>;
  abstract findAllCursor(
    courseId: string,
    options: FindExamAttemptsCursorQuery,
  ): Promise<CursorPageDto<ExamAttempt>>;
  abstract findById(id: string): Promise<ExamAttempt | null>;
}
