import { Module } from '@nestjs/common';
import { CryptoPort } from '../../application/ports/crypto.port';
import { NodeCryptoAdapter } from './node-crypto.adapter';

@Module({
  providers: [
    {
      provide: CryptoPort,
      useClass: NodeCryptoAdapter,
    },
  ],
  exports: [CryptoPort],
})
export class CryptoModule {}
