import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface QuestionsBankFilter {
  search?: string;
  createdAt?: DateFilter;
}
