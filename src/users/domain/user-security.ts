import { EmailAlreadyVerifiedException } from './exceptions/email-already-verified.exception';
import { InvalidVerificationTokenException } from './exceptions/invalid-verification-token.exception';
import { EmailNotVerifiedFor2FAException } from './exceptions/email-not-verified-for-2fa.exception';
import { InvalidResetTokenException } from './exceptions/invalid-reset-token.exception';
import { ResetTokenExpiredException } from './exceptions/reset-token-expired.exception';
import { UserSecurityProps } from './interfaces/user-security.props';

export class UserSecurity {
  constructor(private readonly props: UserSecurityProps) {}

  get propsData(): UserSecurityProps {
    return this.props;
  }

  get password(): string {
    return this.props.password;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get isTwoFactorEnabled(): boolean {
    return this.props.isTwoFactorEnabled;
  }

  get refreshToken(): string | null {
    return this.props.refreshToken;
  }

  get twoFactorSecret(): string | null {
    return this.props.twoFactorSecret;
  }

  get emailVerificationToken(): string | null {
    return this.props.emailVerificationToken;
  }

  get passwordResetToken(): string | null {
    return this.props.passwordResetToken;
  }

  get passwordResetExpires(): Date | null {
    return this.props.passwordResetExpires;
  }

  updatePassword(newPassword: string): void {
    this.props.password = newPassword;
  }

  updateRefreshToken(newToken: string | null): void {
    this.props.refreshToken = newToken;
  }

  setVerificationToken(token: string): void {
    this.props.emailVerificationToken = token;
  }

  verifyEmail(providedToken: string): void {
    if (this.props.isEmailVerified) {
      throw new EmailAlreadyVerifiedException();
    }
    if (this.props.emailVerificationToken !== providedToken) {
      throw new InvalidVerificationTokenException();
    }
    this.props.isEmailVerified = true;
    this.props.emailVerificationToken = null;
  }

  markEmailVerified(): void {
    this.props.isEmailVerified = true;
    this.props.emailVerificationToken = null;
  }

  enableTwoFactorAuth(secret: string): void {
    if (!this.props.isEmailVerified) {
      throw new EmailNotVerifiedFor2FAException();
    }
    this.props.isTwoFactorEnabled = true;
    this.props.twoFactorSecret = secret;
  }

  disableTwoFactorAuth(): void {
    this.props.isTwoFactorEnabled = false;
    this.props.twoFactorSecret = null;
  }

  setTwoFactorSecret(secret: string): void {
    this.props.twoFactorSecret = secret;
  }

  generatePasswordResetToken(token: string, expiresAt: Date): void {
    this.props.passwordResetToken = token;
    this.props.passwordResetExpires = expiresAt;
  }

  resetPasswordWithToken(newPassword: string, providedToken: string): void {
    if (this.props.passwordResetToken !== providedToken) {
      throw new InvalidResetTokenException();
    }
    if (
      !this.props.passwordResetExpires ||
      this.props.passwordResetExpires < new Date()
    ) {
      throw new ResetTokenExpiredException();
    }
    this.props.password = newPassword;
    this.props.passwordResetToken = null;
    this.props.passwordResetExpires = null;
  }
}
