import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface DiscussionQuestionFilter {
  search?: string;
  createdAt?: DateFilter;
}
