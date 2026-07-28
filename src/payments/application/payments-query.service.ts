import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { Payment } from 'src/generated/prisma/client';
import { PaymentQueryRepository } from './ports/payment-query.repository';
import { FindCursorQuery, FindQuery } from 'src/common/interfaces/find.query';

@Injectable()
export class PaymentsQueryService {
  constructor(
    private readonly paymentQueryRepository: PaymentQueryRepository,
  ) {}

  async findAll(pageOptionsDto: FindQuery): Promise<PageDto<Payment>> {
    return this.paymentQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    userId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Payment>> {
    return this.paymentQueryRepository.findAllCursor(userId, options);
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentQueryRepository.findById(id);
    if (!payment) throw new NotFoundException('errors.PAYMENT_NOT_FOUND');
    return payment;
  }
}
