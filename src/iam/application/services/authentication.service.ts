import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
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

    if (user.getIsTwoFactorAuthenticationEnabled()) {
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
      user.getPasswordHash(),
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

  private async validate2FACode(user: User, tfaCode?: string): Promise<void> {
    if (!tfaCode) {
      throw new TwoFactorRequiredException();
    }

    const { valid } = await this.otp.verify({
      token: tfaCode,
      secret: user.getTwoFactorAuthenticationSecret()!,
    });

    if (!valid) {
      throw new Invalid2FACodeException();
    }
  }

  private async generateUniqueUsername(
    displayName: string,
    email: string,
  ): Promise<string> {
    const base =
      this.normalizeUsername(displayName) ||
      this.normalizeUsername(email.split('@')[0]) ||
      'user';

    let username = base;
    let counter = 1;

    while (await this.usersQueryService.findByUsername(username)) {
      username = `${base}${counter}`;
      counter++;
    }

    return username;
  }

  private normalizeUsername(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);
  }
}
