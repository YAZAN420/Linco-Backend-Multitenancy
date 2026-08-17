import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DemosCommandService } from '../../application/demo/demos-command.service';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

@Injectable()
export class DemoEventsListener {
  private readonly logger = new Logger(DemoEventsListener.name);

  constructor(private readonly demosCommandService: DemosCommandService) {}

  @OnEvent('demo.subscribed')
  async handleDemoSubscribed(payload: {
    userId: string;
    demoId: string;
    plan: PlanTier;
    stripeSubscriptionId: string;
    currentPeriodEnd: Date;
  }) {
    this.logger.log(`🔊 Handling demo.subscribed for Demo: ${payload.demoId}`);
    try {
      await this.demosCommandService.activateDemoSubscription(
        payload.demoId,
        payload.plan,
        payload.stripeSubscriptionId,
        payload.currentPeriodEnd,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to process demo.subscribed: ${error}`);
    }
  }

  @OnEvent('demo.subscription_renewed')
  async handleSubscriptionRenewed(payload: {
    stripeSubscriptionId: string;
    currentPeriodEnd: Date;
  }) {
    this.logger.log(
      `🔄 Handling demo.subscription_renewed for Sub: ${payload.stripeSubscriptionId}`,
    );
    try {
      await this.demosCommandService.renewDemoSubscription(
        payload.stripeSubscriptionId,
        payload.currentPeriodEnd,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process demo.subscription_renewed: ${error}`,
      );
    }
  }

  @OnEvent('demo.subscription_updated')
  async handleSubscriptionUpdated(payload: {
    stripeSubscriptionId: string;
    plan: PlanTier;
    currentPeriodEnd: Date;
  }) {
    this.logger.log(
      `🆙 Handling demo.subscription_updated for Sub: ${payload.stripeSubscriptionId} (Plan: ${payload.plan})`,
    );
    try {
      await this.demosCommandService.updateDemoSubscriptionPlan(
        payload.stripeSubscriptionId,
        payload.plan,
        payload.currentPeriodEnd,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process demo.subscription_updated: ${error}`,
      );
    }
  }

  @OnEvent('demo.subscription_payment_failed')
  async handleSubscriptionPaymentFailed(payload: {
    stripeSubscriptionId: string;
    customerEmail: string;
    attemptCount: number;
  }) {
    this.logger.warn(
      `⚠️ Handling demo.subscription_payment_failed for Sub: ${payload.stripeSubscriptionId} (Attempt: ${payload.attemptCount})`,
    );
    try {
      await this.demosCommandService.handlePaymentFailure(
        payload.stripeSubscriptionId,
        payload.attemptCount,
        payload.customerEmail,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process demo.subscription_payment_failed: ${error}`,
      );
    }
  }

  @OnEvent('demo.subscription_canceled')
  async handleSubscriptionCanceled(payload: { stripeSubscriptionId: string }) {
    this.logger.log(
      `🛑 Handling demo.subscription_canceled for Sub: ${payload.stripeSubscriptionId}`,
    );
    try {
      await this.demosCommandService.cancelDemoSubscription(
        payload.stripeSubscriptionId,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to process demo.subscription_canceled: ${error}`,
      );
    }
  }
}
