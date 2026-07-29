import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TokenPort } from '../ports/token.port';
import { HashingPort } from '../ports/hashing.port';

import { User } from 'src/users/domain/user';
import { TokenPair } from '../../domain/interfaces/token-pair.interface';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenPort: TokenPort,
    private readonly hashingPort: HashingPort,
    private readonly usersCommandService: UsersCommandService,
    private readonly logger: Logger,
  ) {}

  async generateTokens(user: User): Promise<TokenPair> {
    const tokenPair = await this.tokenPort.generateTokenPair(user);

    const hashedRefreshToken = await this.hashingPort.hash(
      tokenPair.refreshToken,
    );

    await this.usersCommandService.updateRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return tokenPair;
  }
  async generateTwoFactorToken(userId: string): Promise<string> {
    return this.tokenPort.signToken(userId, 300, { purpose: '2FA' });
  }

  async verifyTwoFactorToken(token: string): Promise<string> {
    try {
      const payload = await this.tokenPort.verifyToken<{
        id?: string;
        sub?: string;
        purpose?: string;
      }>(token);

      if (payload.purpose !== '2FA') {
        throw new UnauthorizedException('errors.INVALID_TOKEN_PURPOSE');
      }

      const userId = payload.id || payload.sub;
      if (!userId) {
        throw new UnauthorizedException('errors.USER_ID_MISSING_IN_TOKEN');
      }

      return userId;
    } catch (error) {
      this.logger.warn(`Invalid 2FA token: ${error}`);
      throw new UnauthorizedException('errors.INVALID_OR_EXPIRED_2_FA_TOKEN');
    }
  }

  async refreshTokens(refreshTokenDto: {
    refreshToken: string;
  }): Promise<{ tokens: TokenPair }> {
    const refreshToken = refreshTokenDto.refreshToken;

    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.getUserAndValidateToken(payload.id, refreshToken);
    const tokens = await this.generateTokens(user);

    return { tokens };
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.usersCommandService.updateRefreshToken(userId, null);
  }

  private async verifyRefreshToken(token: string): Promise<{ id: string }> {
    try {
      return await this.tokenPort.verifyRefreshToken<{ id: string }>(token);
    } catch (error) {
      this.logger.warn(`Invalid refresh token: ${error}`);
      throw new UnauthorizedException('errors.INVALID_REFRESH_TOKEN');
    }
  }

  public async verifyAccessToken(token: string): Promise<ActiveUserData> {
    try {
      return await this.tokenPort.verifyToken<ActiveUserData>(token);
    } catch (error) {
      this.logger.warn(`Invalid access token: ${error}`);
      throw new UnauthorizedException('errors.INVALID_ACCESS_TOKEN');
    }
  }

  private async getUserAndValidateToken(
    userId: string,
    token: string,
  ): Promise<User> {
    const user = await this.usersCommandService.findById(userId);

    const isValid = await this.hashingPort.compare(
      token,
      user.security.refreshToken ?? '',
    );

    if (!isValid) {
      throw new UnauthorizedException('errors.ACCESS_DENIED');
    }

    return user;
  }
}
