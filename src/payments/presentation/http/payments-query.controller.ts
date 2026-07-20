import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

import { PaymentsQueryService } from 'src/payments/application/payments-query.service';

import { PaymentResponseMapper } from './mappers/payment-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@ApiTags('Payment')
@Controller('payments')
export class PaymentsQueryController {
  constructor(
    private readonly paymentQueryService: PaymentsQueryService,
    private readonly paymentResponseMapper: PaymentResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: PageOptionsDto) {
    const payments = await this.paymentQueryService.findAll(options);
    return {
      message: 'Payments fetched successfully',
      data: this.paymentResponseMapper.toResponseManyFromPrisma(payments.data),
      meta: payments.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const payments = await this.paymentQueryService.findAllCursor(
      user.id,
      options,
    );

    return {
      message: 'Payments fetched successfully ',
      data: this.paymentResponseMapper.toResponseManyFromPrisma(payments.data),
      meta: payments.meta,
    };
  }

  @Get(':paymentId')
  async findOne(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentQueryService.findById(paymentId);

    return {
      message: 'Payment retrieved successfully',
      data: this.paymentResponseMapper.toResponseFromPrisma(payment),
    };
  }
}
