import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { TokenPair } from 'src/iam/domain/interfaces/token-pair.interface';
import { TokenPort } from 'src/iam/application/ports/token.port';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { User } from 'src/users/domain/user';

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { id: userId, ...payload },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async verifyToken<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
    });
  }

  async generateTokenPair(user: User): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.getId(),
        this.jwtConfiguration.accessTokenTtl,
        { email: user.getEmailValue(), role: user.getRole() },
      ),
      this.signToken(user.getId(), this.jwtConfiguration.refreshTokenTtl),
    ]);

    return { accessToken, refreshToken };
  }
}
