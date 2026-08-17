import {
  Controller,
  Body,
  Post,
  Req,
  Headers,
  BadRequestException,
  Get,
  Query,
  RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';

import { PaymentsCommandService } from 'src/payments/application/payments-command.service';
import { PaymentGatewayPort } from 'src/payments/application/ports/payment-gateway.port';
import { BuyCourseDto, SubscribeToDemoDto } from './dto/checkout.dto';
import { Public } from 'src/iam/presentation/http/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('Payment')
@Controller('payments')
export class PaymentsCommandController {
  constructor(
    private readonly paymentCommandService: PaymentsCommandService,
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @UseGuards(DemoRolesGuard)
  @Post('checkout/demo')
  async subscribeToDemo(
    @ActiveUser() user: ActiveUserData,
    @ActiveDemoMember('demoId') demoId: string,
    @Body() body: SubscribeToDemoDto,
  ) {
    const url = await this.paymentCommandService.initiateDemoSubscription(
      user.id,
      demoId,
      user.email,
      body.plan,
    );

    return { url };
  }

  @UseGuards(DemoRolesGuard)
  @Post('checkout/course')
  async buyCourse(
    @ActiveUser() user: ActiveUserData,
    @ActiveDemoMember('demoId') demoId: string,
    @Body() body: BuyCourseDto,
  ) {
    const url = await this.paymentCommandService.initiateCoursePurchase(
      user.id,
      body.courseId,
      demoId,
      user.email,
    );

    return url;
  }

  @Get('checkout/status')
  async getCheckoutStatus(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException(
        'errors.SESSION_ID_QUERY_PARAMETER_IS_REQUIRED',
      );
    }

    return await this.paymentCommandService.getCheckoutStatus(sessionId);
  }

  @Public()
  @SkipThrottle()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody;

    if (!rawBody) {
      throw new BadRequestException('errors.RAW_BODY_IS_UNAVAILABLE');
    }

    try {
      const event = this.paymentGateway.verifyWebhookEvent(rawBody, signature);

      await this.paymentCommandService.processWebhookEvent(event);

      return { received: true };
    } catch (err) {
      console.log(`Webhook validation failed: ${err}`);
      throw new BadRequestException('errors.WEBHOOK_VALIDATION_FAILED');
    }
  }
}
