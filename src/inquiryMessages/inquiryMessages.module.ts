import { DynamicModule, Module, Type } from '@nestjs/common';
import { InquiryMessagesCommandController } from './presentation/http/inquiryMessages-command.controller';
import { InquiryMessagesQueryController } from './presentation/http/inquiryMessages-query.controller';
import { InquiryMessageFactory } from './domain/factories/inquiryMessage.factory';
import { InquiryMessagesCommandService } from './application/inquiryMessages-command.service';
import { InquiryMessagesQueryService } from './application/inquiryMessages-query.service';
import { InquiryMessageResponseMapper } from './presentation/http/mappers/inquiryMessage-response.mapper';

@Module({
  imports: [],
  controllers: [
    InquiryMessagesCommandController,
    InquiryMessagesQueryController,
  ],
  providers: [
    InquiryMessagesCommandService,
    InquiryMessagesQueryService,
    InquiryMessageFactory,
    InquiryMessageResponseMapper,
  ],
  exports: [
    InquiryMessagesCommandService,
    InquiryMessagesQueryService,
    InquiryMessageFactory,
    InquiryMessageResponseMapper,
  ],
})
export class InquiryMessagesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: InquiryMessagesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
