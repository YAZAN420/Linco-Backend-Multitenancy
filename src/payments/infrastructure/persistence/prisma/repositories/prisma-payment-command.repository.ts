import { Injectable } from '@nestjs/common';
import { PaymentCommandRepository } from 'src/payments/application/ports/payment-command.repository';
import { Payment } from 'src/payments/domain/payment';
import { PrismaPaymentMapper } from '../mappers/prisma-payment.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaPaymentCommandRepository implements PaymentCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaPaymentMapper,
  ) {}

  async save(payment: Payment): Promise<void> {
    const data = this.mapper.toPersistence(payment);
    await this.prisma.payment.upsert({
      where: { id: payment.id },
      update: data,
      create: data,
    });
  }

  async findById(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    return payment ? this.mapper.toDomain(payment) : null;
  }

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
  ): Promise<Payment | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId },
    });
    return payment ? this.mapper.toDomain(payment) : null;
  }
}
