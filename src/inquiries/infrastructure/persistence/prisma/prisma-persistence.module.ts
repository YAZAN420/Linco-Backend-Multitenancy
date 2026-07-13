import { Module } from '@nestjs/common';
import { InquiryCommandRepository } from 'src/inquiries/application/ports/inquiry-command.repository';
import { PrismaInquiryCommandRepository } from './repositories/prisma-inquiry-command.repository';
import { InquiryQueryRepository } from 'src/inquiries/application/ports/inquiry-query.repository';
import { PrismaInquiryQueryRepository } from './repositories/prisma-inquiry-query.repository';
import { PrismaInquiryMapper } from './mappers/prisma-inquiry.mapper';

@Module({
  providers: [
    PrismaInquiryMapper,
    {
      provide: InquiryCommandRepository,
      useClass: PrismaInquiryCommandRepository,
    },
    {
      provide: InquiryQueryRepository,
      useClass: PrismaInquiryQueryRepository,
    },
  ],
  exports: [InquiryCommandRepository, InquiryQueryRepository],
})
export class PrismaPersistenceModule {}
