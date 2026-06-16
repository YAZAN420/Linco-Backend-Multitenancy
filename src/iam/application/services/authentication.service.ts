import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { OTP } from 'otplib';
import { HashingPort } from '../ports/hashing.port';
import { TokenService } from './token.service';

import { User } from 'src/users/domain/user';
import {
  EmailNotVerifiedException,
  TwoFactorRequiredException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { SignInResult } from 'src/iam/domain/interfaces/sign-in-result.interface';
import { GoogleUserData } from 'src/iam/domain/interfaces/google-user-data.interface';
import { Role } from 'src/users/domain/enums/role.enum';
import { UsersCommandService } from 'src/users/application/users-command.service';

@Injectable()
export class AuthenticationService {
  private readonly otp = new OTP();
  private readonly googleOAuthClient = new OAuth2Client();

  constructor(
    private readonly hashingPort: HashingPort,
    private readonly tokenService: TokenService,
    private readonly usersCommandService: UsersCommandService,
  ) {}

  async signIn(user: User, tfaCode?: string): Promise<SignInResult> {
    if (!user.security.isEmailVerified) {
      throw new EmailNotVerifiedException();
    }

    if (user.security.isTwoFactorEnabled) {
      await this.validate2FACode(user, tfaCode);
    }

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersCommandService.findByEmail(email);

    if (!user) return null;

    if (!user.security.password) {
      return null;
    }

    const isPasswordValid = await this.hashingPort.compare(
      password,
      user.security.password,
    );

    return isPasswordValid ? user : null;
  }

  async signOut(userId: string) {
    await this.tokenService.invalidateRefreshToken(userId);
  }

  async signInWithGoogle(googleUser: GoogleUserData): Promise<SignInResult> {
    const email = googleUser.email.trim().toLowerCase();

    let user = await this.usersCommandService.findByEmail(email);

    if (!user) {
      user = await this.usersCommandService.create({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        imagePath: googleUser.imagePath,
        role: Role.USER,
      });
    }

    if (!user.security.isEmailVerified) {
      user = await this.usersCommandService.markEmailAsVerified(user.id);
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
      secret: user.security.twoFactorSecret!,
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

      const firstName = payload.given_name?.trim() || email.split('@')[0];

      const lastName = payload.family_name?.trim() || '';

      const imagePath = payload.picture?.trim() ?? '';

      return {
        email,
        firstName,
        lastName,
        imagePath,
        providerId,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }
  }
}
