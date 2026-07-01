import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentGatewayPort } from '../../application/ports/payment-gateway.port';
import { ConfigModule } from '@nestjs/config';
import stripeConfig from 'src/common/config/stripe.config';

@Module({
  imports: [ConfigModule.forFeature(stripeConfig)],
  providers: [
    {
      provide: PaymentGatewayPort,
      useClass: StripeService,
    },
  ],
  exports: [PaymentGatewayPort],
})
export class StripeInfrastructureModule {}
