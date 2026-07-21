import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig from 'src/common/config/jwt.config';

import { IamApplicationModule } from './application/application.module';
import { IamPresentationModule } from './presentation/presentation.module';
import { CaslModule } from './infrastructure/authorization/casl/casl.module';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.secret,
        signOptions: {
          audience: jwtConfiguration.audience,
          issuer: jwtConfiguration.issuer,
          expiresIn: jwtConfiguration.accessTokenTtl,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
    CaslModule,
    IamApplicationModule,
    IamPresentationModule,
  ],
  exports: [IamApplicationModule, CaslModule, JwtModule],
})
export class IamModule {}
