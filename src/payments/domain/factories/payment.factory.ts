import { Injectable } from '@nestjs/common';
import { Payment } from '../payment';
import { v7 as uuidv7 } from 'uuid';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentType } from '../enums/payment-type.enum';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

@Injectable()
export class PaymentFactory {
  public createNew(
    amount: number,
    currency: string,
    userId: string,
    type: PaymentType,
    plan?: PlanTier,
    demoId?: string,
    courseId?: string,
  ): Payment {
    const now = new Date();
    return new Payment(uuidv7(), {
      amount,
      currency,
      status: PaymentStatus.PENDING,
      userId,
      demoId,
      type,
      plan,
      courseId,
      stripeInvoiceId: undefined,
      stripePaymentIntentId: undefined,
      createdAt: now,
      updatedAt: now,
    });
  }
}
