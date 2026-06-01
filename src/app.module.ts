import { Module, DynamicModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DemosModule } from './demos/demos.module';
import { DemosInfrastructureModule } from './demos/infrastructure/demos-infrastructure.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        IamModule,
        CoreModule.forRoot(),
        UsersModule.withInfrastructure(UsersInfrastructureModule.use()),
        DemosModule.withInfrastructure(DemosInfrastructureModule.use()),
      ],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    };
  }
}
