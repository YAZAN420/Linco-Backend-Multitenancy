import { Role } from 'src/users/domain/enums/role.enum';
import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface UserFilter {
  search?: string;
  role?: Role;
  isEmailVerified?: boolean;
  createdAt?: DateFilter;
  birthDate?: DateFilter;
}
