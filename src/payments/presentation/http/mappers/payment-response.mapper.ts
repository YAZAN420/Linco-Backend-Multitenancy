import { Injectable } from '@nestjs/common';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { Payment as PrismaPayment } from 'src/generated/prisma/client';
import { Payment as DomainPayment } from 'src/payments/domain/payment';
import { PaymentType } from 'src/payments/domain/enums/payment-type.enum';

@Injectable()
export class PaymentResponseMapper {
  toResponseFromPrisma(payment: PrismaPayment): PaymentResponseDto {
    return new PaymentResponseDto(
      payment.id,
      payment.amount,
      payment.currency,
      payment.status,
      payment.type as PaymentType,
      payment.plan ?? undefined,
      payment.demoId ?? undefined,
      payment.courseId ?? undefined,
      payment.createdAt,
      payment.updatedAt,
    );
  }

  toResponseFromDomain(payment: DomainPayment): PaymentResponseDto {
    return new PaymentResponseDto(
      payment.id,
      payment.amount,
      payment.currency,
      payment.status,
      payment.type,
      payment.plan ?? undefined,
      payment.demoId ?? undefined,
      payment.courseId ?? undefined,
      payment.createdAt,
      payment.updatedAt,
    );
  }

  toResponseManyFromPrisma(payments: PrismaPayment[]): PaymentResponseDto[] {
    return payments.map((payment) => this.toResponseFromPrisma(payment));
  }
}
