import { Role } from 'src/users/domain/enums/role.enum';

export interface ActiveUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
