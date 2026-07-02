import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DemosCommandService } from 'src/demos/application/demo/demos-command.service';

@Injectable()
export class DemosCron {
  private readonly logger = new Logger(DemosCron.name);

  constructor(private readonly demosCommandService: DemosCommandService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredTrials() {
    this.logger.log('Cron triggered: Checking for expired trial demos...');
    try {
      await this.demosCommandService.expireFinishedTrials();

      this.logger.log('Successfully completed expired trials check.');
    } catch (error) {
      this.logger.error('Failed to run expired trials cron job', error);
    }
  }
}
