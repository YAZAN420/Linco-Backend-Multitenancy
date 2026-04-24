import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { TokenPort } from '../../application/ports/token.port';
import { JwtTokenAdapter } from './jwt-token.adapter';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [
    {
      provide: TokenPort,
      useClass: JwtTokenAdapter,
    },
  ],
  exports: [TokenPort],
})
export class TokenModule {}
