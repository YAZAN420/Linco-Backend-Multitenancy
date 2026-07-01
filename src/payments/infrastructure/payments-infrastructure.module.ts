import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';
import { StripeInfrastructureModule } from './stripe/stripe-infrastructure.module';

@Module({})
export class PaymentsInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;
    const stripeModule = StripeInfrastructureModule;

    return {
      module: PaymentsInfrastructureModule,
      imports: [persistenceModule, stripeModule],
      exports: [persistenceModule, stripeModule],
    };
  }
}
