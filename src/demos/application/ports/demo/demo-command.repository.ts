import { Demo } from 'src/demos/domain/demo';

export abstract class DemoCommandRepository {
  abstract save(demo: Demo): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Demo | null>;
  abstract findByOwnerId(ownerId: string): Promise<Demo | null>;
  abstract findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<Demo | null>;
  abstract updateExpiredTrials(): Promise<void>;
}
