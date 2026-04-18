import { Module, DynamicModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import { CoreModule } from './core/core.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import bullConfig from './config/bull.config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';

@Module({})
export class AppModule {
  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        IamModule,
        UsersModule.withInfrastructure(
          UsersInfrastructureModule.use(options.driver),
        ),
        BullModule.forRootAsync({
          inject: [bullConfig.KEY],
          useFactory: (bullConfiguration: ConfigType<typeof bullConfig>) =>
            bullConfiguration,
        }),
        BullBoardModule.forRoot({
          route: '/queues',
          adapter: ExpressAdapter,
        }),
      ],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
      ],
    };
  }
}
