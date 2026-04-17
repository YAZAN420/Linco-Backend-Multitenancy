import { Role } from './enums/role.enum';

export interface UserPersistenceData {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
  refreshToken: string | null;
  twoFactorAuthenticationSecret: string | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
