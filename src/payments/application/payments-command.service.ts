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
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';

@Injectable()
export class PaymentsCommandService {
  constructor(
    private readonly paymentCommandRepository: PaymentCommandRepository,
    private readonly courseCommandRepository: CourseCommandRepository,
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

    if (plan === PlanTier.STARTER) {
      priceId = this.stripeConfiguration.starterPriceId!;
      amount = 2000;
    } else if (plan === PlanTier.PRO) {
      priceId = this.stripeConfiguration.proPriceId!;
      amount = 10000;
    } else if (plan === PlanTier.ENTERPRISE) {
      priceId = this.stripeConfiguration.enterprisePriceId!;
      amount = 20000;
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
    demoId: string,
    userEmail: string,
  ) {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.price === 0) {
      this.eventEmitter.emit('course.purchased', {
        userId: userId,
        courseId: courseId,
        demoId: demoId,
        isFree: true,
      });
      return {
        message: 'Free course added to assets successfully',
        data: null,
      };
    }

    const payment = this.paymentFactory.createNew(
      course.price,
      'usd',
      userId,
      PaymentType.COURSE,
      undefined,
      demoId,
      courseId,
    );

    await this.paymentCommandRepository.save(payment);

    const result = await this.paymentGateway.createOneTimeCheckoutSession({
      amount: course.price,
      currency: 'usd',
      courseTitle: course.title,
      paymentId: payment.id,
      courseId: courseId,
      userId: userId,
      customerEmail: userEmail,
    });

    return {
      data: {
        url: result.url,
      },
      message: 'Checkout session created successfully',
    };
  }

  async processWebhookEvent(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const paymentId = session.metadata?.paymentId;
      const type = session.metadata?.type;
      const stripeSubscriptionId = session.subscription as string;

      if (!paymentId) return;

      if (type === 'course') {
        await this.fulfillPayment(paymentId, type);
        console.log(`Course payment ${paymentId} succeeded!`);
      } else if (type === 'subscription') {
        const subscription: Stripe.Subscription =
          await this.paymentGateway.getSubscription(stripeSubscriptionId);

        const currentPeriodEnd = new Date(
          subscription.items.data[0].current_period_end * 1000,
        );
        await this.fulfillPayment(
          paymentId,
          type,
          stripeSubscriptionId,
          currentPeriodEnd,
        );
        console.log(
          `Subscription ${paymentId} succeeded! Unlocking demo for user.`,
        );
      }
    }
  }

  async fulfillPayment(
    paymentId: string,
    type: string,
    stripeSubscriptionId?: string,
    currentPeriodEnd?: Date,
  ) {
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
        demoId: payment.demoId,
        isFree: false,
      });
    } else if (type === 'subscription') {
      this.eventEmitter.emit('demo.subscribed', {
        userId: payment.userId,
        demoId: payment.demoId,
        plan: payment.plan,
        stripeSubscriptionId: stripeSubscriptionId,
        currentPeriodEnd: currentPeriodEnd,
      });
    }
  }

  async getCheckoutStatus(sessionId: string) {
    const session = await this.paymentGateway.getCheckoutSession(sessionId);

    const paymentId = session.metadata?.paymentId;
    if (!paymentId) {
      throw new NotFoundException('Payment metadata not found in session');
    }

    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment record not found');
    return {
      status: session.status,
      paymentStatus: session.payment_status,
      isFulfilled: payment.isSuccessful,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: payment.currency,
      metadata: {
        type: session.metadata?.type,
        courseId: session.metadata?.courseId,
        demoId: session.metadata?.demoId,
      },
    };
  }

  async findById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment) throw new NotFoundException('payment not found');
    return payment;
  }
}
