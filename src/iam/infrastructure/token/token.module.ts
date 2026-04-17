import { Module } from '@nestjs/common';
import { TokenPort } from '../../application/ports/token.port';
import { JwtTokenAdapter } from './jwt-token.adapter';

@Module({
  providers: [
    {
      provide: TokenPort,
      useClass: JwtTokenAdapter,
    },
  ],
  exports: [TokenPort],
})
export class TokenModule {}
