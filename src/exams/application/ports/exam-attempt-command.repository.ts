import { ExamAttempt } from 'src/exams/domain/exam-attempt';

export abstract class ExamAttemptCommandRepository {
  abstract save(examAttempt: ExamAttempt): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<ExamAttempt | null>;
  abstract hasPassedAttempt(
    demoMemberId: string,
    examId: string,
    passingScore: number,
  ): Promise<boolean>;
  abstract hasPassedAllPreviousExams(
    demoMemberId: string,
    examId: string,
  ): Promise<boolean>;
}
