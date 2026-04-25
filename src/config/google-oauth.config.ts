import { registerAs } from '@nestjs/config';

export interface GoogleOAuthConfiguration {
  clientId: string | undefined;
  clientSecret: string | undefined;
  callbackUrl: string | undefined;
}

export default registerAs('googleOAuth', (): GoogleOAuthConfiguration => {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  };
});
