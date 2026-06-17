import { QuestionsBankFilter } from './questionsBank-filter.interface';

export interface FindQuestionsBankQuery extends QuestionsBankFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindQuestionsBankCursorQuery extends QuestionsBankFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
