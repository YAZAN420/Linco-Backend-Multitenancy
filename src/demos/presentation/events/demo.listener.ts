import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DemosCommandService } from '../../application/demo/demos-command.service';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

@Injectable()
export class DemoEventsListener {
  constructor(private readonly demosCommandService: DemosCommandService) {}
  @OnEvent('demo.subscribed')
  async handleDemoSubscribed(payload: {
    userId: string;
    demoId: string;
    plan: PlanTier;
    stripeSubscriptionId: string;
    currentPeriodEnd: Date;
  }) {
    console.log(`🔊 Event received in Demo Module for user: ${payload.userId}`);
    try {
      await this.demosCommandService.activateDemoSubscription(
        payload.userId,
        payload.demoId,
        payload.plan,
        payload.stripeSubscriptionId,
        payload.currentPeriodEnd,
      );
    } catch (error) {
      console.error(`❌ Failed to process demo.subscribed event: ${error}`);
    }
  }
}
