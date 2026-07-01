import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentCommandRepository } from './ports/payment-command.repository';
import { Payment } from '../domain/payment';
import { PaymentGatewayPort } from './ports/payment-gateway.port';
import { PaymentFactory } from '../domain/factories/payment.factory';
import { ConfigType } from '@nestjs/config';
import stripeConfig from 'src/common/config/stripe.config';
import Stripe from 'stripe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentType } from '../domain/enums/payment-type.enum';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

@Injectable()
export class PaymentsCommandService {
  constructor(
    private readonly paymentCommandRepository: PaymentCommandRepository,
    private readonly paymentFactory: PaymentFactory,
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,
    private readonly paymentGateway: PaymentGatewayPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initiateDemoSubscription(
    userId: string,
    demoId: string,
    userEmail: string,
    plan: PlanTier,
  ) {
    let priceId: string;
    let amount: number;
    const currency = 'usd';

    if (plan === PlanTier.PRO) {
      priceId = this.stripeConfiguration.proPriceId!;
      amount = 20;
    } else if (plan === PlanTier.ENTERPRISE) {
      priceId = this.stripeConfiguration.enterprisePriceId!;
      amount = 200;
    } else {
      throw new BadRequestException('Invalid subscription plan');
    }

    const payment = this.paymentFactory.createNew(
      amount,
      currency,
      userId,
      PaymentType.SUBSCRIPTION,
      plan,
      demoId,
      undefined,
    );

    await this.paymentCommandRepository.save(payment);

    const result = await this.paymentGateway.createSubscriptionCheckoutSession({
      priceId: priceId,
      demoId: demoId,
      paymentId: payment.id,
      userId: userId,
      customerEmail: userEmail,
    });

    return result.url;
  }

  async initiateCoursePurchase(
    userId: string,
    courseId: string,
    userEmail: string,
  ) {
    const payment = this.paymentFactory.createNew(
      11,
      'usd',
      userId,
      PaymentType.COURSE,
      undefined,
      undefined,
      courseId,
    );

    await this.paymentCommandRepository.save(payment);

    const result = await this.paymentGateway.createOneTimeCheckoutSession({
      amount: 11,
      currency: 'usd',
      courseTitle: 'Temp',
      paymentId: payment.id,
      courseId: courseId,
      userId: userId,
      customerEmail: userEmail,
    });

    return result.url;
  }

  async processWebhookEvent(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const paymentId = session.metadata?.paymentId;
      const type = session.metadata?.type;

      if (!paymentId) return;

      if (type === 'course') {
        await this.fulfillPayment(paymentId, type);
        console.log(`Course payment ${paymentId} succeeded!`);
      } else if (type === 'subscription') {
        await this.fulfillPayment(paymentId, type);
        console.log(
          `Subscription ${paymentId} succeeded! Unlocking demo for user.`,
        );
      }
    }
  }

  async fulfillPayment(paymentId: string, type: string) {
    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');

    if (payment.isSuccessful) {
      return;
    }

    payment.markAsSuccessful();
    await this.paymentCommandRepository.save(payment);
    if (type === 'course') {
      this.eventEmitter.emit('course.purchased', {
        userId: payment.userId,
        courseId: payment.courseId,
      });
    } else if (type === 'subscription') {
      this.eventEmitter.emit('demo.subscribed', {
        userId: payment.userId,
        demoId: payment.demoId,
        plan: payment.plan,
      });
    }
  }

  async findById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment) throw new NotFoundException('payment not found');
    return payment;
  }
}
