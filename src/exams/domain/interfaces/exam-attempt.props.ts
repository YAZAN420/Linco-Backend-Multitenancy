import { PositiveInteger } from "src/common/value-objects/positive-integer.vo";

export interface ExamAttemptProps {
  userId: string,
  examId: string,
  score: PositiveInteger,
  createdAt: Date;
  updatedAt: Date;
}
