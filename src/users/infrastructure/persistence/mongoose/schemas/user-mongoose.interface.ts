export interface UserMongoose {
  _id: string;
  username: string;
  email: string;
  role: string;
  password?: string;
  isEmailVerified: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
  refreshToken?: string;
  twoFactorAuthenticationSecret?: string;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
