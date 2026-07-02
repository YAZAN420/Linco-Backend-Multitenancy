import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentCommandRepository } from 'src/payments/application/ports/payment-command.repository';
import { Payment } from 'src/payments/domain/payment';
import { PrismaPaymentMapper } from '../mappers/prisma-payment.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaPaymentCommandRepository implements PaymentCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaPaymentMapper,
  ) {}

  async save(payment: Payment): Promise<void> {
    const data = this.mapper.toPersistence(payment);
    try {
      await this.prisma.payment.upsert({
        where: { id: payment.id },
        update: data,
        create: data,
      });
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(`Payment Not Found`);
        }
      }
      throw new InternalServerErrorException(
        `Database operation failed ${error}`,
      );
    }
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
