import { Injectable } from '@nestjs/common';
import { HashingPort } from '../ports/hashing.port';
import { TokenService } from './token.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByEmailQuery } from 'src/users/application/queries/get-user-by-email.query';
import { User } from 'src/users/domain/user';
import { OTP } from 'otplib';
import {
  EmailNotVerifiedException,
  TwoFactorRequiredException,
  Invalid2FACodeException,
} from '../../domain/exceptions/index';
import { SignInResult } from 'src/iam/domain/interfaces/sign-in-result.interface';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthenticationService {
  private readonly otp = new OTP();

  constructor(
    private readonly hashingPort: HashingPort,
    private readonly tokenService: TokenService,
    private readonly usersQueryService: UsersQueryService,
    private readonly logger: Logger,
  ) {}

  async signIn(user: User, tfaCode?: string): Promise<SignInResult> {
    if (!user.getIsEmailVerified()) {
      throw new EmailNotVerifiedException();
    }

    if (user.getIsTwoFactorAuthenticationEnabled()) {
      await this.validate2FACode(user, tfaCode);
    }

    const tokens = await this.tokenService.generateTokens(user);

    this.logger.log(`User ${user.getId()} signed in successfully`);

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

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async signOut(userId: string): Promise<{ message: string }> {
    await this.tokenService.invalidateRefreshToken(userId);

    this.logger.log(`User ${userId} signed out successfully`);

    return { message: 'User signed out successfully' };
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
}
