import { Role } from 'src/users/domain/enums/role.enum';

export interface AdminUpdateUserInput {
  role?: Role;
  isEmailVerified?: boolean;
}
