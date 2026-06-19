import { ExamFilter } from './exam-filter.interface';

export interface FindExamsQuery extends ExamFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindExamsCursorQuery extends ExamFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
