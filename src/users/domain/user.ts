import { Role } from './enums/role.enum';
import { Email } from './value-objects/email.vo';
import { Username } from './value-objects/username.vo';
import { EmailAlreadyVerifiedException } from './exceptions/email-already-verified.exception';
import { EmailNotVerifiedFor2FAException } from './exceptions/email-not-verified-for-2fa.exception';
import { InvalidResetTokenException } from './exceptions/invalid-reset-token.exception';
import { InvalidVerificationTokenException } from './exceptions/invalid-verification-token.exception';
import { ResetTokenExpiredException } from './exceptions/reset-token-expired.exception';

export class User {
  constructor(
    public readonly id: string,
    private username: Username,
    private email: Email,
    private role: Role,
    private passwordHash: string,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private isEmailVerified: boolean,
    private isTwoFactorAuthenticationEnabled: boolean,
    private refreshToken: string | null = null,
    private twoFactorAuthenticationSecret: string | null = null,
    private emailVerificationToken: string | null = null,
    private passwordResetToken: string | null = null,
    private passwordResetExpires: Date | null = null,
  ) {}

  getId(): string {
    return this.id;
  }

  getUsernameValue(): string {
    return this.username.getValue();
  }

  getEmailValue(): string {
    return this.email.getValue();
  }

  getRole(): Role {
    return this.role;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getIsTwoFactorEnabled(): boolean {
    return this.isTwoFactorAuthenticationEnabled;
  }

  getIsEmailVerified(): boolean {
    return this.isEmailVerified;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getTwoFactorSecret(): string | null {
    return this.twoFactorAuthenticationSecret;
  }

  getEmailVerificationToken(): string | null {
    return this.emailVerificationToken;
  }

  getPasswordResetToken(): string | null {
    return this.passwordResetToken;
  }

  getPasswordResetExpires(): Date | null {
    return this.passwordResetExpires;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  changeUsername(newUsernameStr: string): void {
    this.username = new Username(newUsernameStr);
    this.touch();
  }

  changePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.touch();
  }

  changeRole(newRole: Role): void {
    this.role = newRole;
    this.touch();
  }

  updateRefreshToken(newToken: string | null): void {
    this.refreshToken = newToken;
    this.touch();
  }

  validateRefreshToken(tokenToValidate: string): boolean {
    return this.refreshToken === tokenToValidate;
  }

  setVerificationToken(token: string): void {
    this.emailVerificationToken = token;
    this.touch();
  }

  verifyEmail(providedToken: string): void {
    if (this.isEmailVerified) {
      throw new EmailAlreadyVerifiedException();
    }
    if (this.emailVerificationToken !== providedToken) {
      throw new InvalidVerificationTokenException();
    }
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.touch();
  }

  markEmailVerified(): void {
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.touch();
  }

  enableTwoFactorAuth(secret: string): void {
    if (!this.isEmailVerified) {
      throw new EmailNotVerifiedFor2FAException();
    }
    this.isTwoFactorAuthenticationEnabled = true;
    this.twoFactorAuthenticationSecret = secret;
    this.touch();
  }

  disableTwoFactorAuth(): void {
    this.isTwoFactorAuthenticationEnabled = false;
    this.twoFactorAuthenticationSecret = null;
    this.touch();
  }

  setTwoFactorSecret(secret: string): void {
    this.twoFactorAuthenticationSecret = secret;
    this.touch();
  }

  generatePasswordResetToken(token: string, expiresAt: Date): void {
    this.passwordResetToken = token;
    this.passwordResetExpires = expiresAt;
    this.touch();
  }

  resetPasswordWithToken(newPasswordHash: string, providedToken: string): void {
    if (this.passwordResetToken !== providedToken) {
      throw new InvalidResetTokenException();
    }
    if (!this.passwordResetExpires || this.passwordResetExpires < new Date()) {
      throw new ResetTokenExpiredException();
    }
    this.passwordHash = newPasswordHash;
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
