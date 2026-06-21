import { ExamAttemptFilter } from "./exam-attempt-filter.interface copy";

export interface FindExamAttemptsQuery extends ExamAttemptFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindExamAttemptsCursorQuery extends ExamAttemptFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
