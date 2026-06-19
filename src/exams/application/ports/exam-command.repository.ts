import { Exam } from 'src/exams/domain/exam';

export abstract class ExamCommandRepository {
  abstract save(exam: Exam): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Exam | null>;
}
