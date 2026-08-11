import { DateFilter } from 'src/common/interfaces/date-filter.interface';
import { Role } from 'src/users/domain/enums/role.enum';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export interface UserFilter {
  search?: string;
  status?: UserStatus;
  role?: Role;
  createdAt?: DateFilter;
}
