import Stripe from 'stripe';
import { CheckoutSessionResult } from '../interfaces/checkout-session-result.interface';
import { CreateSubscriptionCheckoutParams } from '../interfaces/create-subscription-checkout-params.interface';
import { CreateOneTimeCheckoutParams } from '../interfaces/create-one-time-checkout-params.interface';

export abstract class PaymentGatewayPort {
  abstract createSubscriptionCheckoutSession(
    params: CreateSubscriptionCheckoutParams,
  ): Promise<CheckoutSessionResult>;

  abstract createOneTimeCheckoutSession(
    params: CreateOneTimeCheckoutParams,
  ): Promise<CheckoutSessionResult>;

  abstract verifyWebhookEvent(payload: Buffer, signature: string): Stripe.Event;

  abstract getSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription>;

  abstract getCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session>;

  abstract createCustomerPortalSession(customerId: string): Promise<string>;
}
