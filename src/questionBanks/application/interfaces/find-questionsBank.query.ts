import { QuestionsBankFilter } from './questionsBank-filter.interface';

export interface FindQuestionsBankCursorQuery extends QuestionsBankFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
