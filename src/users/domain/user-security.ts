// src/users/domain/user-security.ts
import { EmailAlreadyVerifiedException } from './exceptions/email-already-verified.exception';
import { InvalidVerificationTokenException } from './exceptions/invalid-verification-token.exception';
import { EmailNotVerifiedFor2FAException } from './exceptions/email-not-verified-for-2fa.exception';
import { InvalidResetTokenException } from './exceptions/invalid-reset-token.exception';
import { ResetTokenExpiredException } from './exceptions/reset-token-expired.exception';

export interface UserSecurityProps {
  password: string;
  isEmailVerified: boolean;
  isTwoFactorAuthenticationEnabled: boolean;
  refreshToken: string | null;
  twoFactorAuthenticationSecret: string | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
}

export class UserSecurity {
  constructor(private readonly _props: UserSecurityProps) {}

  // 🔥 تم تحويلها لـ Getter لتجلب كل الخصائص ككائن واحد نظيف (تُستخدم في الـ Mapper مثلاً)
  get propsData(): UserSecurityProps {
    return this._props;
  }

  // 🔥 تحويل دوال الجلب إلى Getters (خصائص مباشرة بدون أقواس)
  get password(): string {
    return this._props.password;
  }

  get isEmailVerified(): boolean {
    return this._props.isEmailVerified;
  }

  get isTwoFactorEnabled(): boolean {
    return this._props.isTwoFactorAuthenticationEnabled;
  }

  get refreshToken(): string | null {
    return this._props.refreshToken;
  }

  get twoFactorSecret(): string | null {
    return this._props.twoFactorAuthenticationSecret;
  }

  get emailVerificationToken(): string | null {
    return this._props.emailVerificationToken;
  }

  get passwordResetToken(): string | null {
    return this._props.passwordResetToken;
  }

  get passwordResetExpires(): Date | null {
    return this._props.passwordResetExpires;
  }

  // 🛠️ دالات التعديل والإجراءات (Domain Actions) تبقى دالات عادية بـ () لأنها تغير حالة الدومين
  changePassword(newPassword: string): void {
    this._props.password = newPassword;
  }

  updateRefreshToken(newToken: string | null): void {
    this._props.refreshToken = newToken;
  }

  setVerificationToken(token: string): void {
    this._props.emailVerificationToken = token;
  }

  verifyEmail(providedToken: string): void {
    if (this._props.isEmailVerified) {
      throw new EmailAlreadyVerifiedException();
    }
    if (this._props.emailVerificationToken !== providedToken) {
      throw new InvalidVerificationTokenException();
    }
    this._props.isEmailVerified = true;
    this._props.emailVerificationToken = null;
  }

  markEmailVerified(): void {
    this._props.isEmailVerified = true;
    this._props.emailVerificationToken = null;
  }

  enableTwoFactorAuth(secret: string): void {
    if (!this._props.isEmailVerified) {
      throw new EmailNotVerifiedFor2FAException();
    }
    this._props.isTwoFactorAuthenticationEnabled = true;
    this._props.twoFactorAuthenticationSecret = secret;
  }

  disableTwoFactorAuth(): void {
    this._props.isTwoFactorAuthenticationEnabled = false;
    this._props.twoFactorAuthenticationSecret = null;
  }

  setTwoFactorSecret(secret: string): void {
    this._props.twoFactorAuthenticationSecret = secret;
  }

  generatePasswordResetToken(token: string, expiresAt: Date): void {
    this._props.passwordResetToken = token;
    this._props.passwordResetExpires = expiresAt;
  }

  resetPasswordWithToken(newPassword: string, providedToken: string): void {
    if (this._props.passwordResetToken !== providedToken) {
      throw new InvalidResetTokenException();
    }
    if (
      !this._props.passwordResetExpires ||
      this._props.passwordResetExpires < new Date()
    ) {
      throw new ResetTokenExpiredException();
    }
    this._props.password = newPassword;
    this._props.passwordResetToken = null;
    this._props.passwordResetExpires = null;
  }
}
