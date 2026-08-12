import { DateFilter } from 'src/common/interfaces/date-filter.interface';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

export interface DemoFilter {
  search?: string;
  status?: SubscriptionStatus;
  createdAt?: DateFilter;
}
