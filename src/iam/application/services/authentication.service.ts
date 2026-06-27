import { Injectable } from '@nestjs/common';
import { OTP } from 'otplib';
import { HashingPort } from '../ports/hashing.port';
import { TokenService } from './token.service';
import { GoogleAuthPort } from '../ports/google-auth.port';

import { User } from 'src/users/domain/user';
import {
  EmailNotVerifiedException,
  TwoFactorRequiredException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { SignInResult } from 'src/iam/domain/interfaces/sign-in-result.interface';
import { Role } from 'src/users/domain/enums/role.enum';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { GoogleUserData } from '../interfaces/google-user-data.interface';

@Injectable()
export class AuthenticationService {
  private readonly otp = new OTP();

  constructor(
    private readonly hashingPort: HashingPort,
    private readonly tokenService: TokenService,
    private readonly usersCommandService: UsersCommandService,
    private readonly googleAuthPort: GoogleAuthPort,
  ) {}

  async signIn(user: User): Promise<SignInResult> {
    if (!user.security.isEmailVerified) throw new EmailNotVerifiedException();
    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersCommandService.findByEmail(email);
    if (!user || !user.security.password) return null;

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
    let user = await this.usersCommandService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersCommandService.create({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        imagePath: googleUser.imagePath,
        role: Role.USER,
        isEmailVerified: true,
      });
    } else if (!user.security.isEmailVerified) {
      user = await this.usersCommandService.markEmailAsVerified(user.id);
    }

    const tokens = await this.tokenService.generateTokens(user);
    return { user, tokens };
  }

  async signInWithGoogleIdToken(idToken: string): Promise<SignInResult> {
    const googleUser = await this.googleAuthPort.verifyIdToken(idToken);
    return this.signInWithGoogle(googleUser);
  }

  private async validate2FACode(user: User, tfaCode?: string): Promise<void> {
    if (!tfaCode) throw new TwoFactorRequiredException();
    const { valid } = await this.otp.verify({
      token: tfaCode,
      secret: user.security.twoFactorSecret!,
    });
    if (!valid) throw new Invalid2FACodeException();
  }
}
