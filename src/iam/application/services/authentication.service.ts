import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { OTP } from 'otplib';
import { HashingPort } from '../ports/hashing.port';
import { TokenService } from './token.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByEmailQuery } from 'src/users/application/queries/get-user-by-email.query';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { User } from 'src/users/domain/user';
import {
  EmailNotVerifiedException,
  TwoFactorRequiredException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { SignInResult } from 'src/iam/domain/interfaces/sign-in-result.interface';
import { MessageResponse } from '../interfaces/message-response.interface';
import { GoogleUserData } from 'src/iam/domain/interfaces/google-user-data.interface';

@Injectable()
export class AuthenticationService {
  private readonly otp = new OTP();
  private readonly googleOAuthClient = new OAuth2Client();

  constructor(
    private readonly hashingPort: HashingPort,
    private readonly tokenService: TokenService,
    private readonly usersQueryService: UsersQueryService,
    private readonly usersCommandService: UsersCommandService,
  ) {}

  async signIn(user: User, tfaCode?: string): Promise<SignInResult> {
    if (!user.getIsEmailVerified()) {
      throw new EmailNotVerifiedException();
    }

    if (user.getIsTwoFactorEnabled()) {
      await this.validate2FACode(user, tfaCode);
    }

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const query = new GetUserByEmailQuery(email);
    const user = await this.usersQueryService.findByEmail(query);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.hashingPort.compare(
      password,
      user.getPassword(),
    );

    return isPasswordValid ? user : null;
  }

  async signOut(userId: string): Promise<MessageResponse> {
    await this.tokenService.invalidateRefreshToken(userId);
    return { message: 'User signed out successfully' };
  }

  async signInWithGoogle(googleUser: GoogleUserData): Promise<SignInResult> {
    const email = googleUser.email.trim().toLowerCase();
    let user = await this.usersQueryService.findByEmail(
      new GetUserByEmailQuery(email),
    );

    if (!user) {
      const username = await this.generateUniqueUsername(
        googleUser.displayName,
        email,
      );
      const randomPassword = randomBytes(32).toString('hex');

      user = await this.usersCommandService.create(
        new CreateUserCommand(username, email, randomPassword),
      );
    }

    if (!user.getIsEmailVerified()) {
      user.markEmailVerified();
      await this.usersCommandService.save(user);
    }

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  async signInWithGoogleIdToken(idToken: string): Promise<SignInResult> {
    const googleUser = await this.verifyGoogleIdToken(idToken);
    return this.signInWithGoogle(googleUser);
  }

  private async validate2FACode(user: User, tfaCode?: string): Promise<void> {
    if (!tfaCode) {
      throw new TwoFactorRequiredException();
    }

    const { valid } = await this.otp.verify({
      token: tfaCode,
      secret: user.getTwoFactorSecret()!,
    });

    if (!valid) {
      throw new Invalid2FACodeException();
    }
  }

  private async verifyGoogleIdToken(idToken: string): Promise<GoogleUserData> {
    if (!idToken?.trim()) {
      throw new UnauthorizedException('Google ID token is required');
    }

    const audience = process.env.GOOGLE_CLIENT_ID?.trim();
    if (!audience) {
      throw new UnauthorizedException('Google client ID is not configured');
    }

    try {
      const ticket = await this.googleOAuthClient.verifyIdToken({
        idToken,
        audience,
      });
      const payload = ticket.getPayload();

      const email = payload?.email?.trim().toLowerCase();
      const emailVerified = payload?.email_verified === true;
      const providerId = payload?.sub;

      if (!email || !providerId || !emailVerified) {
        throw new UnauthorizedException('Invalid Google ID token payload');
      }

      return {
        email,
        displayName:
          payload?.name?.trim() ||
          payload?.given_name?.trim() ||
          email.split('@')[0],
        providerId,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }

  private async generateUniqueUsername(
    displayName: string,
    email: string,
  ): Promise<string> {
    const baseUsername =
      this.normalizeUsername(displayName) ||
      this.normalizeUsername(email.split('@')[0]) ||
      'user';

    let counter = 0;
    while (counter < 1000) {
      const suffix = counter === 0 ? '' : String(counter);
      const maxBaseLength = Math.max(3, 20 - suffix.length);
      const username = `${baseUsername.slice(0, maxBaseLength)}${suffix}`;

      if (!(await this.usersQueryService.findByUsername(username))) {
        return username;
      }
      counter += 1;
    }

    return `user${Date.now().toString().slice(-8)}`;
  }

  private normalizeUsername(value: string): string {
    const normalized = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    if (normalized.length < 3) {
      return '';
    }

    return normalized.slice(0, 20);
  }
}
