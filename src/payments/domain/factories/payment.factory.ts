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
    if (demoId && courseId) {
      throw new Error('Payment cannot belong to both demo and course');
    }
    if (!demoId && !courseId) {
      throw new Error('Payment must belong to demo or course');
    }

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
