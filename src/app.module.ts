import { Module, DynamicModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CoreModule } from './core/core.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { UsersInfrastructureModule } from './users/infrastructure/users-infrastructure.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DemosModule } from './demos/demos.module';
import { DemosInfrastructureModule } from './demos/infrastructure/demos-infrastructure.module';
import { CoursesModule } from './courses/courses.module';
import { CoursesInfrastructureModule } from './courses/infrastructure/courses-infrastructure.module';
import { LessonsModule } from './lessons/lessons.module';
import { LessonsInfrastructureModule } from './lessons/infrastructure/lessons-infrastructure.module';
import { AssetsModule } from './assets/assets.module';
import { AssetsInfrastructureModule } from './assets/infrastructure/assets-infrastructure.module';
import { QuestionsBankModule } from './questionsBank/questionsBank.module';
import { QuestionsBankInfrastructureModule } from './questionsBank/infrastructure/questionsBank-infrastructure.module';


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
        CoursesModule.withInfrastructure(CoursesInfrastructureModule.use()),
        LessonsModule.withInfrastructure(LessonsInfrastructureModule.use()),
        AssetsModule.withInfrastructure(AssetsInfrastructureModule.use()),
        QuestionsBankModule.withInfrastructure(QuestionsBankInfrastructureModule.use()),
      ],
      providers: [
        // { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    };
  }
}
