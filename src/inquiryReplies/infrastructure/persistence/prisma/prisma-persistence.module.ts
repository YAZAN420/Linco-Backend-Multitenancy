import { Module } from '@nestjs/common';
import { InquiryReplyCommandRepository } from 'src/inquiryReplies/application/ports/inquiryReply-command.repository';
import { PrismaInquiryReplyCommandRepository } from './repositories/prisma-inquiryReply-command.repository';
import { InquiryReplyQueryRepository } from 'src/inquiryReplies/application/ports/inquiryReply-query.repository';
import { PrismaInquiryReplyQueryRepository } from './repositories/prisma-inquiryReply-query.repository';
import { PrismaInquiryReplyMapper } from './mappers/prisma-inquiryReply.mapper';

@Module({
  providers: [
    PrismaInquiryReplyMapper,
    {
      provide: InquiryReplyCommandRepository,
      useClass: PrismaInquiryReplyCommandRepository,
    },
    {
      provide: InquiryReplyQueryRepository,
      useClass: PrismaInquiryReplyQueryRepository,
    },
  ],
  exports: [InquiryReplyCommandRepository, InquiryReplyQueryRepository],
})
export class PrismaPersistenceModule {}
