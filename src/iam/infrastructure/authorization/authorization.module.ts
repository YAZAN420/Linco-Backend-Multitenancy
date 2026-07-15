import { Global, Module } from '@nestjs/common';
import { AuthorizationQueryRepository } from '../../application/ports/authorization-query.repository';
import { PrismaAuthorizationQueryRepository } from './prisma-authorization-query.repository';

@Global()
@Module({
  providers: [
    {
      provide: AuthorizationQueryRepository,
      useClass: PrismaAuthorizationQueryRepository,
    },
  ],
  exports: [AuthorizationQueryRepository],
})
export class AuthorizationModule {}
