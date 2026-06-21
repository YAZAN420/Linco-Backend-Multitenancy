import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface ExamAttemptFilter {
  search?: string;
  createdAt?: DateFilter;
}
