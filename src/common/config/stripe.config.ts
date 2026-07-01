import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  frontEndUrl: process.env.FRONTEND_URL,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  starterPriceId: process.env.STRIPE_STARTER_PRICE_ID,
  proPriceId: process.env.STRIPE_PRO_PRICE_ID,
  enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
}));
