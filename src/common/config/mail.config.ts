import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  gmailClientId: process.env.GOOGLE_CLIENT_ID,
  gmailClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN,
  fromAddress: process.env.MAIL_FROM_ADDRESS || '',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
}));
