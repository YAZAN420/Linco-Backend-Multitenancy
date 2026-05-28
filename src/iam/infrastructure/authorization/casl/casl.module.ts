import { Global, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthorizationPort } from '../../../application/ports/authorization.port';
import { CaslAdapter } from './casl.adapter';

@Global()
@Module({
  providers: [
    CaslAbilityFactory,
    {
      provide: AuthorizationPort,
      useClass: CaslAdapter,
    },
  ],
  exports: [AuthorizationPort],
})
export class CaslModule {}
