import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface LessonFilter {
  search?: string;
  createdAt?: DateFilter;
}
