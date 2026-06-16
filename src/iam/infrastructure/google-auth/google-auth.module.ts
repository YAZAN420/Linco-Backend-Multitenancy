import { Module } from '@nestjs/common';
import { GoogleAuthAdapter } from './google-auth.adapter';
import { GoogleAuthPort } from '../../application/ports/google-auth.port';

@Module({
  providers: [
    {
      provide: GoogleAuthPort,
      useClass: GoogleAuthAdapter,
    },
  ],
  exports: [GoogleAuthPort],
})
export class GoogleAuthModule {}
