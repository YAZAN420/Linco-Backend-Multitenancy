import { DynamicModule, Module, Type } from '@nestjs/common';
import { InquiryRepliesCommandController } from './presentation/http/inquiryReplies-command.controller';
import { InquiryRepliesQueryController } from './presentation/http/inquiryReplies-query.controller';
import { InquiryReplyFactory } from './domain/factories/inquiryReply.factory';
import { InquiryRepliesCommandService } from './application/inquiryReplies-command.service';
import { InquiryRepliesQueryService } from './application/inquiryReplies-query.service';
import { InquiryReplyResponseMapper } from './presentation/http/mappers/inquiryReply-response.mapper';

@Module({
  imports: [], 
  controllers: [InquiryRepliesCommandController, InquiryRepliesQueryController],
  providers: [
    InquiryRepliesCommandService,
    InquiryRepliesQueryService,
    InquiryReplyFactory, 
    InquiryReplyResponseMapper
    ],
  exports: [
    InquiryRepliesCommandService,
    InquiryRepliesQueryService,
    InquiryReplyFactory,
    InquiryReplyResponseMapper
    ],
})
export class InquiryRepliesModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: InquiryRepliesModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}