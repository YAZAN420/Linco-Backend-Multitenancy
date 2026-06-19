import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface ExamFilter {
  search?: string;
  createdAt?: DateFilter;
}
