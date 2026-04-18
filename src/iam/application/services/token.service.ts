import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPort } from '../ports/token.port';
import { HashingPort } from '../ports/hashing.port';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByIdQuery } from 'src/users/application/queries/get-user-by-id.query';
import { RefreshTokenDto } from 'src/iam/presentation/http/dto/refresh-token.dto';
import { User } from 'src/users/domain/user';
import { TokenPair } from '../../domain/interfaces/token-pair.interface';
import { Logger } from 'nestjs-pino';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenPort: TokenPort,
    private readonly hashingPort: HashingPort,
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly logger: Logger,
  ) {}

  async generateTokens(user: User): Promise<TokenPair> {
    const tokenPair = await this.tokenPort.generateTokenPair(user);

    const hashedRefreshToken = await this.hashingPort.hash(
      tokenPair.refreshToken,
    );

    await this.usersCommandService.updateRefreshToken(
      user.getId(),
      hashedRefreshToken,
    );

    return tokenPair;
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ tokens: TokenPair }> {
    try {
      const { id } = await this.tokenPort.verifyToken<{ id: string }>(
        refreshTokenDto.refreshToken!,
      );

      const query = new GetUserByIdQuery(id);
      const user = await this.usersQueryService.findById(query);

      const isValid = await this.hashingPort.compare(
        refreshTokenDto.refreshToken!,
        user.getRefreshToken() ?? '',
      );

      if (!isValid) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.generateTokens(user);

      return { tokens: tokens };
    } catch (error) {
      this.logger.warn(`Failed to refresh tokens: ${error}`);
      throw new UnauthorizedException('Access Denied');
    }
  }

  async invalidateRefreshToken(userId: string): Promise<void> {
    await this.usersCommandService.updateRefreshToken(userId, null);
  }
}
