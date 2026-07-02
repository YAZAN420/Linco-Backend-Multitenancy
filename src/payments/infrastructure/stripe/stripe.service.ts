import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';

import stripeConfig from 'src/common/config/stripe.config';

import {
  CreateOneTimeCheckoutParams,
  CreateSubscriptionCheckoutParams,
  PaymentGatewayPort,
} from '../../application/ports/payment-gateway.port';
import { CheckoutSessionResult } from '../../application/interfaces/checkout-session-result.interface';

@Injectable()
export class StripeService implements PaymentGatewayPort {
  private readonly stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private readonly stripeConfiguration: ConfigType<typeof stripeConfig>,
  ) {
    this.stripe = new Stripe(this.stripeConfiguration.stripeSecretKey!, {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    });
  }

  async createSubscriptionCheckoutSession(
    params: CreateSubscriptionCheckoutParams,
  ): Promise<CheckoutSessionResult> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',

        payment_method_types: ['card'],

        customer_email: params.customerEmail,

        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],

        metadata: {
          type: 'subscription',
          paymentId: params.paymentId,
          demoId: params.demoId,
          userId: params.userId,
        },

        success_url: `${this.stripeConfiguration.frontEndUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${this.stripeConfiguration.frontEndUrl}/payment-cancel`,
      });

      if (!session.url) {
        throw new Error('Stripe did not return checkout url.');
      }

      return {
        url: session.url,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create subscription checkout session: ${error}`,
      );
    }
  }

  async createOneTimeCheckoutSession(
    params: CreateOneTimeCheckoutParams,
  ): Promise<CheckoutSessionResult> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',

        payment_method_types: ['card'],

        customer_email: params.customerEmail,

        line_items: [
          {
            price_data: {
              currency: params.currency.toLowerCase(),

              product_data: {
                name: params.courseTitle,
              },

              unit_amount: Math.round(params.amount * 100),
            },

            quantity: 1,
          },
        ],

        metadata: {
          type: 'course',
          paymentId: params.paymentId,
          courseId: params.courseId,
          userId: params.userId,
        },

        success_url: `${this.stripeConfiguration.frontEndUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${this.stripeConfiguration.frontEndUrl}/payment-cancel`,
      });

      if (!session.url) {
        throw new Error('Stripe did not return checkout url.');
      }

      return {
        url: session.url,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create one-time checkout session: ${error}`,
      );
    }
  }

  verifyWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.stripeConfiguration.stripeWebhookSecret!,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Webhook signature verification failed: ${error}`,
      );
    }
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch subscription from Stripe: ${error}`,
      );
    }
  }

  async getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      return await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch checkout session: ${error}`,
      );
    }
  }
}
