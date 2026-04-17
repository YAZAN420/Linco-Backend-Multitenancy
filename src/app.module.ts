import { Module, DynamicModule, OnApplicationBootstrap } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import { CoreModule } from './core/core.module';
import { CacheModule } from './core/cache/cache.module';
import { DatabaseModule } from './core/database/database.module';
import { MailModule } from './core/mail/mail.module';
import { CachePort } from './core/cache/cache.port';

import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';

import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import redisConfig from './config/redis.config';
import { ConfigType } from '@nestjs/config';

@Module({})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly cachePort: CachePort) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.cachePort.deleteByPattern('GET:*');
      console.log('✅ Cache cleared on bootstrap');
    } catch (err) {
      console.error('❌ Failed to clear cache on bootstrap', err);
    }
  }

  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        CacheModule,
        DatabaseModule.use(options.driver),
        MailModule,

        IamModule,
        UsersModule.withInfrastructure(
          UsersInfrastructureModule.use(options.driver),
        ),

        BullModule.forRootAsync({
          useFactory: (redisConfiguration: ConfigType<typeof redisConfig>) => ({
            connection: {
              host: redisConfiguration.host,
              port: redisConfiguration.port,
              password: redisConfiguration.password,
              tls: redisConfiguration.password
                ? { rejectUnauthorized: false }
                : undefined,
              maxRetriesPerRequest: null,
              enableReadyCheck: false,
              keepAlive: 30000,
              retryStrategy: (times: number) => Math.min(times * 100, 3000),
            },
          }),
          inject: [redisConfig.KEY],
        }),
        BullBoardModule.forRoot({
          route: '/queues',
          adapter: ExpressAdapter,
        }),
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: HttpCacheInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: ResponseInterceptor,
        },
      ],
    };
  }
}
