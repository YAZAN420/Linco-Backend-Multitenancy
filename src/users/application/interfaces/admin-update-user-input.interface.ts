import { Role } from 'src/users/domain/enums/role.enum';

export interface AdminUpdateUserInput {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  imagePath?: string | null;
  role?: Role;
  isEmailVerified?: boolean;
}
