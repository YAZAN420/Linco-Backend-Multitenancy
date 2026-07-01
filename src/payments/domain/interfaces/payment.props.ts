import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentType } from '../enums/payment-type.enum';

export interface PaymentProps {
  amount: number;
  currency: string;
  status: PaymentStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  type: PaymentType;

  plan?: PlanTier;
  demoId?: string;
  courseId?: string;
  stripeInvoiceId?: string;
  stripePaymentIntentId?: string;
}
