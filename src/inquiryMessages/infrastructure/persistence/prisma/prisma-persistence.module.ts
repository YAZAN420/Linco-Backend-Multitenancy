import { Module } from '@nestjs/common';
import { InquiryMessageCommandRepository } from 'src/inquiryMessages/application/ports/inquiryMessage-command.repository';
import { PrismaInquiryMessageCommandRepository } from './repositories/prisma-inquiryMessage-command.repository';
import { InquiryMessageQueryRepository } from 'src/inquiryMessages/application/ports/inquiryMessage-query.repository';
import { PrismaInquiryMessageQueryRepository } from './repositories/prisma-inquiryMessage-query.repository';
import { PrismaInquiryMessageMapper } from './mappers/prisma-inquiryMessage.mapper';

@Module({
  providers: [
    PrismaInquiryMessageMapper,
    {
      provide: InquiryMessageCommandRepository,
      useClass: PrismaInquiryMessageCommandRepository,
    },
    {
      provide: InquiryMessageQueryRepository,
      useClass: PrismaInquiryMessageQueryRepository,
    },
  ],
  exports: [InquiryMessageCommandRepository, InquiryMessageQueryRepository],
})
export class PrismaPersistenceModule {}
