import { registerAs } from '@nestjs/config';

export default registerAs('jitsi', () => {
  return {
    appId: process.env.JITSI_APP_ID || 'my-app-id',
    keyId: process.env.JITSI_KEY_ID || 'my-key-id',
    privateKey: process.env.JITSI_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
});
