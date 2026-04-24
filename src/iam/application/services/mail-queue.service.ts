import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MAIL_CONSTANTS } from '../constants/mail.constants';
import {
  EnqueueMailOptions,
  MailJobData,
} from '../interfaces/mail-job-data.interface';

@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue(MAIL_CONSTANTS.QUEUE_NAME)
    private readonly mailQueue: Queue,
  ) {}

  async enqueue(
    jobName: string,
    data: MailJobData,
    options?: EnqueueMailOptions,
  ): Promise<void> {
    await this.mailQueue.add(jobName, data, {
      priority: options?.priority,
      attempts: MAIL_CONSTANTS.RETRY_ATTEMPTS,
      backoff: {
        type: 'exponential',
        delay: MAIL_CONSTANTS.RETRY_DELAY_MS,
      },
      removeOnComplete: true,
    });
  }
}
