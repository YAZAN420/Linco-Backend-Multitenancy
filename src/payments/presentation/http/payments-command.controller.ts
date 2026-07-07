import {
  Controller,
  Body,
  Post,
  Req,
  Headers,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';

import { PaymentsCommandService } from 'src/payments/application/payments-command.service';
import { PaymentGatewayPort } from 'src/payments/application/ports/payment-gateway.port';
import { BuyCourseDto, SubscribeToDemoDto } from './dto/checkout.dto';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('payments')
export class PaymentsCommandController {
  constructor(
    private readonly paymentCommandService: PaymentsCommandService,
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post('checkout/demo')
  async subscribeToDemo(
    @ActiveUser() user: ActiveUserData,
    @Body() body: SubscribeToDemoDto,
  ) {
    const userId = user.id;

    const url = await this.paymentCommandService.initiateDemoSubscription(
      userId,
      body.demoId,
      user.email,
      body.plan,
    );

    return { url };
  }

  @Post('checkout/course')
  async buyCourse(
    @ActiveUser() user: ActiveUserData,
    @Body() body: BuyCourseDto,
  ) {
    const userId = user.id;

    const url = await this.paymentCommandService.initiateCoursePurchase(
      userId,
      body.courseId,
      body.demoId,
      user.email,
    );

    return { url };
  }

  @Get('checkout/status')
  async getCheckoutStatus(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('session_id query parameter is required');
    }

    return await this.paymentCommandService.getCheckoutStatus(sessionId);
  }

  @Public()
  @SkipThrottle()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
  ) {
    const rawBody = req.body as Buffer;

    try {
      const event = this.paymentGateway.verifyWebhookEvent(rawBody, signature);

      await this.paymentCommandService.processWebhookEvent(event);

      return { received: true };
    } catch (err) {
      console.log(`Webhook validation failed: ${err}`);
      throw new BadRequestException('Webhook validation failed');
    }
  }
}
