import { UsersQueryService } from './users/application/users-query.service';
import { Module, DynamicModule, OnApplicationBootstrap } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { IamModule } from './iam/iam.module';
import { MailModule } from './shared/mail/mail.module';
import { UsersModule } from './users/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { CacheModule } from './common/cache/cache.module';
import { DatabaseModule } from './common/database/database.module';
import { CachePort } from './common/ports/cache.port';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
@Module({
  imports: [
    IamModule,
    MailModule,
    CacheModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_PASSWORD
          ? { rejectUnauthorized: false }
          : undefined,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        keepAlive: 30000,
        retryStrategy(times) {
          return Math.min(times * 100, 3000);
        },
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  providers: [
    UsersQueryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly cachePort: CachePort) {}
  onApplicationBootstrap() {
    this.cachePort
      .deleteByPattern('GET:*')
      .then(() => console.log('✅ Cache cleared successfully'))
      .catch((err) => {
        console.error(err);
      });
  }
  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot({ driver: options.driver }),

        DatabaseModule.use(options.driver),

        UsersModule.withInfrastructure(
          UsersInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
