import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import databaseConfig from 'src/config/database.config';
import appConfig from 'src/config/app.config';
import { validate } from 'src/config/env.validation';
import redisConfig from 'src/config/redis.config';

import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import bullConfig from 'src/config/bull.config';

@Global()
@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions): DynamicModule {
    const dbImports =
      options.driver === 'mongoose'
        ? [
            MongooseModule.forRootAsync({
              useFactory: (
                databaseConfiguration: ConfigType<typeof databaseConfig>,
              ) => ({
                uri: databaseConfiguration.uri,
              }),
              inject: [databaseConfig.KEY],
            }),
          ]
        : [];

    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, redisConfig, bullConfig],
          validate: validate,
        }),
        ThrottlerModule.forRoot([{ ttl: 10000, limit: 10 }]),
        ClsModule.forRoot({ global: true, middleware: { mount: true } }),
        ...dbImports,

        CacheModule,
        DatabaseModule.use(options.driver),
        MailModule,
      ],
      exports: [
        ConfigModule,
        ClsModule,
        CacheModule,
        DatabaseModule,
        MailModule,
      ],
    };
  }
}
