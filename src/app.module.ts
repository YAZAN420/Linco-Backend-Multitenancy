import { GoogleAuthModule } from './iam/infrastructure/google-auth/google-auth.module';
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
import { TagsModule } from './tags/tags.module';

import { DepartmentCoursesModule } from './departmentCourses/departmentCourses.module';
import { DepartmentCoursesInfrastructureModule } from './departmentCourses/infrastructure/departmentCourses-infrastructure.module';
import { QuestionsBanksModule } from './questionBanks/questionBanks.module';
import { QuestionsBanksInfrastructureModule } from './questionBanks/infrastructure/questionBanks-infrastructure.module';
import { DiscussionQuestionsModule } from './discussionQuestions/discussionQuestions.module';
import { DiscussionQuestionsInfrastructureModule } from './discussionQuestions/infrastructure/discussionQuestions-infrastructure.module';
import { ExamsModule } from './exams/exams.module';
import { ExamsInfrastructureModule } from './exams/infrastructure/exams-infrastructure.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsInfrastructureModule } from './payments/infrastructure/payments-infrastructure.module';
import { JitsiModule } from './jitsi/jitsi.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        GoogleAuthModule,
        IamModule,
        TagsModule,
        JitsiModule,
        CoreModule.forRoot(),
        UsersModule.withInfrastructure(UsersInfrastructureModule.use()),
        DemosModule.withInfrastructure(DemosInfrastructureModule.use()),
        CoursesModule.withInfrastructure(CoursesInfrastructureModule.use()),
        LessonsModule.withInfrastructure(LessonsInfrastructureModule.use()),
        AssetsModule.withInfrastructure(AssetsInfrastructureModule.use()),
        QuestionsBanksModule.withInfrastructure(
          QuestionsBanksInfrastructureModule.use(),
        ),
        DepartmentCoursesModule.withInfrastructure(
          DepartmentCoursesInfrastructureModule.use(),
        ),
        DiscussionQuestionsModule.withInfrastructure(
          DiscussionQuestionsInfrastructureModule.use(),
        ),
        ExamsModule.withInfrastructure(ExamsInfrastructureModule.use()),
        PaymentsModule.withInfrastructure(PaymentsInfrastructureModule.use()),
      ],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    };
  }
}
