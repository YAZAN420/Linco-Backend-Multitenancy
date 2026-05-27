import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from 'src/core/mail/mail.module';
import { MAIL_CONSTANTS } from '../../application/constants/mail.constants';
import { MailProcessor } from '../../application/processors/mail.processor';

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({ name: MAIL_CONSTANTS.QUEUE_NAME }),
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class MailQueueModule {}
