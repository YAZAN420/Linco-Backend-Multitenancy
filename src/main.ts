import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { setupApp } from './setup/app.setup';
import { setupSwagger } from './setup/swagger.setup';
import type { Express } from 'express';
const bootstrapLogger = new NestLogger('Bootstrap');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule.register(), {
      bufferLogs: true,
    });

    const logger = app.get(PinoLogger);
    app.useLogger(logger);
    const instance = app.getHttpAdapter().getInstance() as Express;
    instance.set('query parser', 'extended');
    setupApp(app);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const nodeEnv = configService.get<string>(
      'NODE_ENV',
      process.env.NODE_ENV ?? 'development',
    );
    const swaggerEnabled =
      (process.env.SWAGGER_ENABLED ?? '').toLowerCase() === 'true' ||
      nodeEnv !== 'production';

    if (swaggerEnabled) {
      setupSwagger(app);
    }

    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application is running on: https://api.lincolms.me`);
    if (swaggerEnabled) {
      logger.log(`📚 Swagger documentation at: https://api.lincolms.me`);
    }
  } catch (error) {
    const trace = error instanceof Error ? error.stack : undefined;
    bootstrapLogger.error('Application failed to start', trace);
    process.exit(1);
  }
}

bootstrap().catch((error: unknown) => {
  const trace = error instanceof Error ? error.stack : undefined;
  bootstrapLogger.error('Unhandled bootstrap error', trace);
  process.exit(1);
});
