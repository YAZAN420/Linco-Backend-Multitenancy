import { DynamicModule, Module, Type } from '@nestjs/common';
import { InquiriesCommandController } from './presentation/http/inquiries-command.controller';
import { InquiriesQueryController } from './presentation/http/inquiries-query.controller';
import { InquiryFactory } from './domain/factories/inquiry.factory';
import { InquiriesCommandService } from './application/inquiries-command.service';
import { InquiriesQueryService } from './application/inquiries-query.service';
import { InquiryResponseMapper } from './presentation/http/mappers/inquiry-response.mapper';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';

@Module({
  imports: [], 
  controllers: [InquiriesCommandController, InquiriesQueryController],
  providers: [
    InquiriesCommandService,
    InquiriesQueryService,
    InquiryFactory, 
    InquiryResponseMapper,    
    ],
  exports: [
    InquiriesCommandService,
    InquiriesQueryService,
    InquiryFactory,
    InquiryResponseMapper
    ],
})
export class InquiriesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: InquiriesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}