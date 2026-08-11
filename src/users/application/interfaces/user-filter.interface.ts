import { DateFilter } from 'src/common/interfaces/date-filter.interface';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export interface UserFilter {
  search?: string;
  status?: UserStatus;
  createdAt?: DateFilter;
}
