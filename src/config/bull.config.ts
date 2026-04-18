import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => {
  const password = process.env.REDIS_PASSWORD;
  return {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
      password: password,
      tls: password ? { rejectUnauthorized: false } : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keepAlive: 30000,
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    },
  };
});
