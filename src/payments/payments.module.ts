import { DynamicModule, Module, Type } from '@nestjs/common';
import { PaymentsCommandController } from './presentation/http/payments-command.controller';
import { PaymentsQueryController } from './presentation/http/payments-query.controller';
import { PaymentFactory } from './domain/factories/payment.factory';
import { PaymentsCommandService } from './application/payments-command.service';
import { PaymentsQueryService } from './application/payments-query.service';
import { PaymentResponseMapper } from './presentation/http/mappers/payment-response.mapper';

@Module({
  imports: [], 
  controllers: [PaymentsCommandController, PaymentsQueryController],
  providers: [
    PaymentsCommandService,
    PaymentsQueryService,
    PaymentFactory, 
    PaymentResponseMapper
    ],
  exports: [
    PaymentsCommandService,
    PaymentsQueryService,
    PaymentFactory,
    PaymentResponseMapper
    ],
})
export class PaymentsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: PaymentsModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}