import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from 'nestjs-pino';
import { MailPort } from 'src/core/mail/mail.port';
import { MAIL_CONSTANTS, MAIL_JOBS } from '../constants/mail.constants';
import { MailJobData } from '../interfaces/mail-job-data.interface';

@Processor(MAIL_CONSTANTS.QUEUE_NAME, { concurrency: 10 })
export class MailProcessor extends WorkerHost {
  private readonly handlers: Record<
    string,
    (data: MailJobData) => Promise<void>
  >;

  constructor(
    private readonly mailPort: MailPort,
    private readonly logger: Logger,
  ) {
    super();
    this.handlers = {
      [MAIL_JOBS.SEND_VERIFICATION_EMAIL]: (data) =>
        this.mailPort.sendVerificationEmail(data.email, data.token),
      [MAIL_JOBS.SEND_PASSWORD_RESET_EMAIL]: (data) =>
        this.mailPort.sendPasswordResetEmail(data.email, data.token),
    };
  }

  async process(job: Job<MailJobData>): Promise<void> {
    const handler = this.handlers[job.name];

    if (!handler) {
      this.logger.warn(`Unknown mail job type: ${job.name}`);
      return;
    }

    await handler(job.data);
    this.logger.log(`${job.name} sent to ${job.data.email}`);
  }
}
