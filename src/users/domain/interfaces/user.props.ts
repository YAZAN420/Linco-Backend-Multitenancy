import { Email } from '../value-objects/email.vo';
import { UserSecurity } from '../user-security';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface UserProps {
  firstName: string;
  lastName: string;
  email: Email;
  birthDate: Date | null;
  imagePath: string;
  role: Role;
  status: UserStatus;
  lastActiveAt: Date | null;
  security: UserSecurity;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
