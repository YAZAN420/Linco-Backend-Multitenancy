import { ExamUserAnswerInput } from './exam-user-answer-input.interface';

export interface CreateExamAttemptInput {
  examId: string;
  answers: ExamUserAnswerInput[];
}
