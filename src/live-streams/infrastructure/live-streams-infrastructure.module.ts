import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jitsiConfig from 'src/common/config/jitsi.config';
import { JitsiTokenPort } from '../application/ports/jitsi-token.port';
import { JaasJitsiTokenService } from './jitsi/jaas-jitsi-token.service';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class LiveStreamsInfrastructureModule {
  static use(): DynamicModule {
    return {
      module: LiveStreamsInfrastructureModule,
      imports: [PrismaPersistenceModule, ConfigModule.forFeature(jitsiConfig)],
      providers: [{ provide: JitsiTokenPort, useClass: JaasJitsiTokenService }],
      exports: [PrismaPersistenceModule, JitsiTokenPort],
    };
  }
}
