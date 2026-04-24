import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { MailModule } from 'src/core/mail/mail.module';
import { MAIL_CONSTANTS } from '../../application/constants/mail.constants';
import { MailProcessor } from '../../application/processors/mail.processor';

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({ name: MAIL_CONSTANTS.QUEUE_NAME }),
    BullBoardModule.forFeature({
      name: MAIL_CONSTANTS.QUEUE_NAME,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [MailProcessor],
  exports: [BullModule],
})
export class MailQueueModule {}
