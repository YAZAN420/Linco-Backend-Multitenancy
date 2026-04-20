import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => {
  return {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD || undefined,
      tls:
        process.env.REDIS_TLS === 'true'
          ? { rejectUnauthorized: true }
          : undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keepAlive: 30000,
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    },
  };
});
