import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';

import stripeConfig from 'src/common/config/stripe.config';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';
import { Course } from 'src/courses/domain/course';

import { Payment } from '../domain/payment';
import { PaymentFactory } from '../domain/factories/payment.factory';
import { PaymentCommandRepository } from './ports/payment-command.repository';
import { PaymentGatewayPort } from './ports/payment-gateway.port';
import { DemosCommandService } from 'src/demos/application/demo/demos-command.service';

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
    private readonly demosCommandService: DemosCommandService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initiateDemoSubscription(
    userId: string,
    demoId: string,
    userEmail: string,
    plan: PlanTier,
  ): Promise<string> {
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
      priceId,
      demoId,
      paymentId: payment.id,
      userId,
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
    this.validateCourseForPurchase(course);

    if (course.price === 0) {
      await this.eventEmitter.emitAsync('course.purchased', {
        userId,
        courseId,
        demoId,
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
      currency: this.DEFAULT_CURRENCY,
      courseTitle: course.title,
      paymentId: payment.id,
      courseId,
      userId,
      customerEmail: userEmail,
    });

    return {
      data: { url: result.url },
      message: 'messages.CHECKOUT_SESSION_CREATED_SUCCESSFULLY',
    };
  }

  async processWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        this.handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.deleted':
        this.handleSubscriptionDeleted(event.data.object);
        break;

      default:
        break;
    }
  }

  async fulfillPayment(
    paymentId: string,
    type: string,
    stripeSubscriptionId?: string,
    currentPeriodEnd?: Date,
  ): Promise<void> {
    const payment = await this.findById(paymentId);
    if (payment.isSuccessful) return;
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
        stripeSubscriptionId,
        currentPeriodEnd,
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

    const payment = await this.findById(paymentId);

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

  async createCustomerPortalSessionForDemo(demoId: string): Promise<string> {
    const demo = await this.demosCommandService.findById(demoId);

    if (!demo.stripeSubscriptionId) {
      throw new BadRequestException(
        'errors.NO_ACTIVE_SUBSCRIPTION_FOUND_FOR_DEMO',
      );
    }

    const subscription = await this.paymentGateway.getSubscription(
      demo.stripeSubscriptionId,
    );

    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;

    return await this.paymentGateway.createCustomerPortalSession(customerId);
  }

  async findById(paymentId: string): Promise<Payment> {
    const payment = await this.paymentCommandRepository.findById(paymentId);
    if (!payment) throw new NotFoundException('errors.PAYMENT_NOT_FOUND');
    return payment;
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const paymentId = session.metadata?.paymentId;
    const type = session.metadata?.type;
    const stripeSubscriptionId = session.subscription as string;

    if (!paymentId) return;

    if (type === 'course') {
      await this.fulfillPayment(paymentId, type);
    } else if (type === 'subscription' && stripeSubscriptionId) {
      const subscription =
        await this.paymentGateway.getSubscription(stripeSubscriptionId);
      const currentPeriodEnd = this.toJsDate(
        subscription.items.data[0].current_period_end,
      );

      await this.fulfillPayment(
        paymentId,
        type,
        stripeSubscriptionId,
        currentPeriodEnd,
      );
    }
  }

  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    if (invoice.billing_reason === 'subscription_create') return;

    const stripeSubscriptionId = this.extractSubscriptionId(invoice);
    if (!stripeSubscriptionId) return;

    const subscription =
      await this.paymentGateway.getSubscription(stripeSubscriptionId);
    const currentPeriodEnd = this.toJsDate(
      subscription.items.data[0].current_period_end,
    );

    this.eventEmitter.emit('demo.subscription_renewed', {
      stripeSubscriptionId,
      currentPeriodEnd,
    });
  }

  private handleInvoicePaymentFailed(invoice: Stripe.Invoice): void {
    const stripeSubscriptionId = this.extractSubscriptionId(invoice);
    if (!stripeSubscriptionId) return;

    this.eventEmitter.emit('demo.subscription_payment_failed', {
      stripeSubscriptionId,
      customerEmail: invoice.customer_email,
      attemptCount: invoice.attempt_count,
    });
  }

  private handleSubscriptionDeleted(subscription: Stripe.Subscription): void {
    this.eventEmitter.emit('demo.subscription_canceled', {
      stripeSubscriptionId: subscription.id,
    });
  }

  private resolvePlanDetails(plan: PlanTier): {
    priceId: string;
    amount: number;
  } {
    const plansMap: Partial<
      Record<PlanTier, { priceId?: string; amount: number }>
    > = {
      [PlanTier.STARTER]: {
        priceId: this.stripeConfiguration.starterPriceId,
        amount: 2000,
      },
      [PlanTier.PRO]: {
        priceId: this.stripeConfiguration.proPriceId,
        amount: 10000,
      },
      [PlanTier.ENTERPRISE]: {
        priceId: this.stripeConfiguration.enterprisePriceId,
        amount: 20000,
      },
    };

    const selectedPlan = plansMap[plan];
    if (!selectedPlan?.priceId) {
      throw new BadRequestException('errors.INVALID_SUBSCRIPTION_PLAN');
    }

    return {
      priceId: selectedPlan.priceId,
      amount: selectedPlan.amount,
    };
  }

  private validateCourseForPurchase(
    course: Course | null,
  ): asserts course is Course {
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
  }

  private extractSubscriptionId(invoice: Stripe.Invoice): string | null {
    const lineItem = invoice.lines?.data?.find((line) => line.subscription);
    if (!lineItem?.subscription) return null;

    return typeof lineItem.subscription === 'string'
      ? lineItem.subscription
      : lineItem.subscription.id;
  }

  private toJsDate(unixTimestampInSeconds: number): Date {
    return new Date(unixTimestampInSeconds * 1000);
  }
}
