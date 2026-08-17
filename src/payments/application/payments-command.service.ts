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
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

@Injectable()
export class PaymentsCommandService {
  private readonly DEFAULT_CURRENCY = 'usd';
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
    const { priceId, amount } = this.resolvePlanDetails(plan);

    const payment = this.paymentFactory.createSubscriptionPayment(
      amount,
      this.DEFAULT_CURRENCY,
      userId,
      demoId,
      plan,
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

  private resolvePlanDetails(plan: PlanTier): {
    priceId: string;
    amount: number;
  } {
    const plansMap: Partial<
      Record<PlanTier, { priceId: string; amount: number }>
    > = {
      [PlanTier.STARTER]: {
        priceId: this.stripeConfiguration.starterPriceId!,
        amount: 2000,
      },
      [PlanTier.PRO]: {
        priceId: this.stripeConfiguration.proPriceId!,
        amount: 10000,
      },
      [PlanTier.ENTERPRISE]: {
        priceId: this.stripeConfiguration.enterprisePriceId!,
        amount: 20000,
      },
    };

    const selectedPlan = plansMap[plan];

    if (!selectedPlan || !selectedPlan.priceId) {
      throw new BadRequestException('errors.INVALID_SUBSCRIPTION_PLAN');
    }

    return {
      priceId: selectedPlan.priceId,
      amount: selectedPlan.amount,
    };
  }

  async initiateCoursePurchase(
    userId: string,
    courseId: string,
    demoId: string,
    userEmail: string,
  ) {
    const course = await this.courseCommandRepository.findById(courseId);
    if (!course) {
      throw new NotFoundException('errors.COURSE_NOT_FOUND');
    }
    if (!course.isPublished) {
      throw new BadRequestException(
        'errors.CANNOT_PURCHASE_AN_UNPUBLISHED_COURSE',
      );
    }

    if (course.visibility === CourseVisibility.PRIVATE) {
      throw new BadRequestException(
        'errors.CANNOT_PURCHASE_A_PRIVATE_COURSE_FROM_THE_MARKETPLACE',
      );
    }

    if (course.price === 0) {
      await this.eventEmitter.emitAsync('course.purchased', {
        userId: userId,
        courseId: courseId,
        demoId: demoId,
        isFree: true,
      });
      return {
        message: 'messages.FREE_COURSE_ADDED_TO_ASSETS_SUCCESSFULLY',
        data: null,
      };
    }

    const payment = this.paymentFactory.createCoursePayment(
      course.price,
      this.DEFAULT_CURRENCY,
      userId,
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
      message: 'messages.CHECKOUT_SESSION_CREATED_SUCCESSFULLY',
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
    if (!payment) throw new NotFoundException('errors.PAYMENT_NOT_FOUND');

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
      throw new NotFoundException(
        'errors.PAYMENT_METADATA_NOT_FOUND_IN_SESSION',
      );
    }

    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment)
      throw new NotFoundException('errors.PAYMENT_RECORD_NOT_FOUND');
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
    if (!payment) throw new NotFoundException('errors.PAYMENT_NOT_FOUND');
    return payment;
  }
}
