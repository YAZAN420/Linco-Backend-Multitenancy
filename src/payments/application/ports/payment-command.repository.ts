import { Payment } from 'src/payments/domain/payment';

export abstract class PaymentCommandRepository {
  abstract save(payment: Payment): Promise<void>;

  abstract findById(id: string): Promise<Payment | null>;

  abstract findByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ): Promise<Payment | null>;
}
