import { Module, Global, DynamicModule } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';

import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { LoggerModule } from './logger/logger.module';
import { AppConfigModule } from './config/app-config.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { ContextModule } from './context/context.module';
import { QueueModule } from './queue/queue.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StorageModule } from './storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GeminiModule } from './gemini/gemini.module';

@Global()
@Module({})
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        GeminiModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        DatabaseModule.use(),
        AppConfigModule,
        RateLimiterModule,
        ContextModule,
        CacheModule,
        MailModule,
        LoggerModule,
        QueueModule,
        StorageModule,
      ],
      exports: [CacheModule, DatabaseModule, MailModule, LoggerModule],
    };
  }
}
