import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { IAM_CONSTANTS, MAIL_JOBS } from '../../domain/constants/iam.constants';
import { MailPort } from 'src/core/mail/mail.port';

interface MailJobData {
  email: string;
  token: string;
}

@Processor(IAM_CONSTANTS.MAIL_QUEUE, { concurrency: 10 })
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  private readonly handlers: Record<
    string,
    (data: MailJobData) => Promise<void>
  >;

  constructor(private readonly mailPort: MailPort) {
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

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.logger.log(
      `Starting job ${job.id} [${job.name}] - Attempt ${job.attemptsMade + 1}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.log(`Job ${job.id} [${job.name}] completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error): void {
    const isLastAttempt = job.attemptsMade >= (job.opts.attempts ?? 0);

    if (isLastAttempt) {
      this.logger.error(
        `Job ${job.id} [${job.name}] permanently failed: ${error.message}`,
        error.stack,
      );
    } else {
      this.logger.warn(
        `Job ${job.id} [${job.name}] failed (attempt ${job.attemptsMade}), will retry`,
      );
    }
  }
}
