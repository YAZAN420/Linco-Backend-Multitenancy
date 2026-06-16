import { Role } from 'src/users/domain/enums/role.enum';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date | null;
  imagePath: string;
  password?: string | null;
  role: Role;
}
