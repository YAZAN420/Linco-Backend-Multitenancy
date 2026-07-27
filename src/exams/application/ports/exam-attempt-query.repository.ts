import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindExamAttemptsCursorQuery } from '../interfaces/find-exam-attempts.query';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';

export abstract class ExamAttemptQueryRepository {
  abstract findAllCursor(
    demoMemberId: string,
    options: FindExamAttemptsCursorQuery,
  ): Promise<CursorPageDto<ExamAttempt>>;
  abstract findById(id: string): Promise<ExamAttempt | null>;
}
