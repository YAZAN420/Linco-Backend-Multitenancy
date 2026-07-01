import Stripe from 'stripe';
import { CheckoutSessionResult } from '../interfaces/checkout-session-result.interface';

export interface CreateSubscriptionCheckoutParams {
  priceId: string;
  customerEmail?: string;
  paymentId: string;
  demoId: string;
  userId: string;
}

export interface CreateOneTimeCheckoutParams {
  amount: number;
  currency: string;
  courseTitle: string;
  customerEmail?: string;
  paymentId: string;
  courseId: string;
  userId: string;
}

export abstract class PaymentGatewayPort {
  abstract createSubscriptionCheckoutSession(
    params: CreateSubscriptionCheckoutParams,
  ): Promise<CheckoutSessionResult>;

  abstract createOneTimeCheckoutSession(
    params: CreateOneTimeCheckoutParams,
  ): Promise<CheckoutSessionResult>;

  abstract verifyWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
}
