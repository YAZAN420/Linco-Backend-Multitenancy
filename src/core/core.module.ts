import { Module, Global, DynamicModule } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';

import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import { AppConfigModule } from './config/app-config.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { ContextModule } from './context/context.module';
import { QueueModule } from './queue/queue.module';

@Global()
@Module({})
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        DatabaseModule.use(),
        AppConfigModule,
        RateLimiterModule,
        ContextModule,
        CacheModule,
        MailModule,
        LoggerModule,
        QueueModule,
      ],
      exports: [CacheModule, DatabaseModule, MailModule, LoggerModule],
    };
  }
}
