import 'dotenv/config';
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
      rawBody: true,
    });
    const logger = app.get(PinoLogger);
    app.useLogger(logger);
    const instance = app.getHttpAdapter().getInstance() as Express;
    instance.set('query parser', 'extended');
    setupApp(app);
    instance.set('trust proxy', 1);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);

    setupSwagger(app);
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: https://api.lincolms.me`);
    logger.log(`📚 Scalar documentation at: https://api.lincolms.me/docs`);
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
