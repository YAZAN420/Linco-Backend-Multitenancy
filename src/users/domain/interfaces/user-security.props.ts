export interface UserSecurityProps {
  password: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  refreshToken: string | null;
  twoFactorSecret: string | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
}
