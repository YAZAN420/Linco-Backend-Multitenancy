import { Role } from 'src/users/domain/enums/role.enum';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export interface ActiveUserData {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  role: Role;
  status: UserStatus;
}
