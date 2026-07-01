import { Injectable } from '@nestjs/common';
import type { Payment as PrismaPayment } from 'src/generated/prisma/client';
import { PaymentStatus } from 'src/payments/domain/enums/payment-status.enum';
import { Payment } from 'src/payments/domain/payment';
import { PaymentType } from '../../../../domain/enums/payment-type.enum';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
@Injectable()
export class PrismaPaymentMapper {
  toDomain(raw: PrismaPayment): Payment {
    return new Payment(raw.id, {
      amount: raw.amount,
      status: raw.status as PaymentStatus,
      currency: raw.currency,
      courseId: raw.courseId ?? undefined,
      demoId: raw.demoId ?? undefined,
      plan: (raw.plan as PlanTier) ?? undefined,
      type: raw.type as PaymentType,
      stripeInvoiceId: raw.stripeInvoiceId ?? undefined,
      stripePaymentIntentId: raw.stripePaymentIntentId ?? undefined,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(payment: Payment): PrismaPayment {
    return {
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      courseId: payment.courseId ?? null,
      demoId: payment.demoId ?? null,
      plan: payment.plan ?? null,
      type: payment.type,
      stripeInvoiceId: payment.stripeInvoiceId ?? null,
      stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
      userId: payment.userId,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
