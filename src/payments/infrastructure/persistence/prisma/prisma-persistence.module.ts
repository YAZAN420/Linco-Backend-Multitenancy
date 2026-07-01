import { Module } from '@nestjs/common';
import { PaymentCommandRepository } from 'src/payments/application/ports/payment-command.repository';
import { PrismaPaymentCommandRepository } from './repositories/prisma-payment-command.repository';
import { PaymentQueryRepository } from 'src/payments/application/ports/payment-query.repository';
import { PrismaPaymentQueryRepository } from './repositories/prisma-payment-query.repository';
import { PrismaPaymentMapper } from './mappers/prisma-payment.mapper';

@Module({
  providers: [
    PrismaPaymentMapper,
    {
      provide: PaymentCommandRepository,
      useClass: PrismaPaymentCommandRepository,
    },
    {
      provide: PaymentQueryRepository,
      useClass: PrismaPaymentQueryRepository,
    },
  ],
  exports: [PaymentCommandRepository, PaymentQueryRepository],
})
export class PrismaPersistenceModule {}
