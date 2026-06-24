export interface UserSecurityProps {
  password: string | null;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  refreshToken: string | null;
  twoFactorSecret: string | null;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
}
