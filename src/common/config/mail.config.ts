import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  fromAddress: process.env.MAIL_FROM_ADDRESS || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  appBaseUrl: process.env.FRONTEND_URL || 'https://lincolms.me',
}));
