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
import { InquiriesModule } from './inquiries/inquiries.module';
import { InquiriesInfrastructureModule } from './inquiries/infrastructure/inquiries-infrastructure.module';
import { CourseFaqsModule } from './courseFaqs/courseFaqs.module';
import { CourseFaqsInfrastructureModule } from './courseFaqs/infrastructure/courseFaqs-infrastructure.module';

import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import { join } from 'path';
import { DepartmentMessagesModule } from './departmentMessages/departmentMessages.module';
import { DepartmentMessagesInfrastructureModule } from './departmentMessages/infrastructure/departmentMessages-infrastructure.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InquiryRepliesModule } from './inquiryReplies/inquiryReplies.module';
import { InquiryRepliesInfrastructureModule } from './inquiryReplies/infrastructure/inquiryReplies-infrastructure.module';
import { CertificationsModule } from './certifications/certifications.module';
import { CertificationsInfrastructureModule } from './certifications/infrastructure/certifications-infrastructure.module';
import { LiveStreamsModule } from './live-streams/live-streams.module';
import { LiveStreamsInfrastructureModule } from './live-streams/infrastructure/live-streams-infrastructure.module';

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        GoogleAuthModule,
        IamModule,
        TagsModule,
        NotificationsModule,
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
        InquiriesModule.withInfrastructure(InquiriesInfrastructureModule.use()),
        CourseFaqsModule.withInfrastructure(
          CourseFaqsInfrastructureModule.use(),
        ),
        DepartmentMessagesModule.withInfrastructure(
          DepartmentMessagesInfrastructureModule.use(),
        ),
        InquiryRepliesModule.withInfrastructure(
          InquiryRepliesInfrastructureModule.use(),
        ),
        CertificationsModule.withInfrastructure(
          CertificationsInfrastructureModule.use(),
        ),
        LiveStreamsModule.withInfrastructure(
          LiveStreamsInfrastructureModule.use(),
        ),
        this.registerI18n(),
      ],
      providers: [
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
      ],
    };
  }
  private static registerI18n(): DynamicModule {
    return I18nModule.forRoot({
      fallbackLanguage: 'en',

      loader: I18nJsonLoader,

      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: false,
      },

      resolvers: [new AcceptLanguageResolver()],
    });
  }
}
