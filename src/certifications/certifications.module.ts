import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { CertificationsCommandService } from './application/certifications-command.service';
import { CertificationsQueryService } from './application/certifications-query.service';
import { ExamAttemptListener } from './application/listeners/exam-attempt.listener';
import { CertificationFactory } from './domain/factories/certification.factory';
import { CertificationsCommandController } from './presentation/http/certifications-command.controller';
import { CertificationsQueryController } from './presentation/http/certifications-query.controller';
import { CertificationResponseMapper } from './presentation/http/mappers/certification-response.mapper';

@Global()
@Module({
  controllers: [CertificationsCommandController, CertificationsQueryController],
  providers: [
    CertificationsCommandService,
    CertificationsQueryService,
    CertificationFactory,
    CertificationResponseMapper,
    ExamAttemptListener,
  ],
  exports: [CertificationsCommandService, CertificationsQueryService],
})
export class CertificationsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CertificationsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
