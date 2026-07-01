import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentType } from './enums/payment-type.enum';
import { PaymentProps } from './interfaces/payment.props';

export class Payment {
  constructor(
    public readonly id: string,
    private readonly props: PaymentProps,
  ) {
    const hasDemo = !!props.demoId;
    const hasCourse = !!props.courseId;
    if (hasDemo && hasCourse) {
      throw new Error('Payment cannot belong to both demo and course');
    }
    if (!hasDemo && !hasCourse) {
      throw new Error('Payment must belong to either demo or course');
    }
  }

  get amount(): number {
    return this.props.amount;
  }

  get type(): PaymentType {
    return this.props.type;
  }

  get plan(): PlanTier | undefined {
    return this.props.plan;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get demoId(): string | undefined {
    return this.props.demoId;
  }

  get courseId(): string | undefined {
    return this.props.courseId;
  }

  get stripeInvoiceId(): string | undefined {
    return this.props.stripeInvoiceId;
  }

  get stripePaymentIntentId(): string | undefined {
    return this.props.stripePaymentIntentId;
  }

  get isSuccessful() {
    return this.props.status === PaymentStatus.SUCCESSFUL;
  }

  get isFinal() {
    return [
      PaymentStatus.SUCCESSFUL,
      PaymentStatus.REFUNDED,
      PaymentStatus.CANCELED,
    ].includes(this.props.status);
  }

  updateStripePaymentIntentId(newStripePaymentIntentId: string) {
    if (newStripePaymentIntentId === this.props.stripePaymentIntentId) return;
    if (!newStripePaymentIntentId?.trim()) return;
    this.props.stripePaymentIntentId = newStripePaymentIntentId;
    this.touch();
  }

  updateStripeInvoiceId(newStripeInvoiceId: string) {
    if (newStripeInvoiceId === this.props.stripeInvoiceId) return;
    if (!newStripeInvoiceId?.trim()) return;
    this.props.stripeInvoiceId = newStripeInvoiceId;
    this.touch();
  }

  markAsSuccessful() {
    this.assertNotFinalState();
    this.props.status = PaymentStatus.SUCCESSFUL;
    this.touch();
  }

  markAsFailed() {
    this.assertNotFinalState();
    this.props.status = PaymentStatus.FAILED;
    this.touch();
  }

  markAsRefunded() {
    this.assertNotFinalState();
    this.props.status = PaymentStatus.REFUNDED;
    this.touch();
  }

  markAsCanceled() {
    this.assertNotFinalState();
    this.props.status = PaymentStatus.CANCELED;
    this.touch();
  }

  private assertNotFinalState() {
    if (this.isFinal) {
      throw new Error('Payment is already finalized');
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
