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
import { AiRagModule } from './ai-rag/ai-rag.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Global()
@Module({})
export class CoreModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        DatabaseModule.use(),

        GeminiModule,
        AiRagModule,

        AppConfigModule,
        RateLimiterModule,
        ContextModule,
        CacheModule,
        MailModule,
        LoggerModule,
        QueueModule,
        StorageModule,

        this.registerI18n(),
      ],

      exports: [
        CacheModule,
        DatabaseModule,
        MailModule,
        LoggerModule,
        I18nModule,
      ],
    };
  }
  private static registerI18n(): DynamicModule {
    return I18nModule.forRoot({
      fallbackLanguage: 'ar',
      loaderOptions: {
        path: path.join(process.cwd(), 'dist/i18n/'),
      },
      resolvers: [new HeaderResolver(['accept-language'])],
    });
  }
}
