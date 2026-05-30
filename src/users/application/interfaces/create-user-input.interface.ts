import { Role } from 'src/users/domain/enums/role.enum';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  imagePath: string;
  password: string;
  role: Role;
}
