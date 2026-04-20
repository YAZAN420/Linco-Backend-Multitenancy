import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { setupApp } from './setup/app.setup';
import { setupSwagger } from './setup/swagger.setup';

async function bootstrap() {
  try {
    const dbDriver =
      (process.env.DB_DRIVER as 'mongoose' | 'in-memory') || 'mongoose';

    const app = await NestFactory.create(
      AppModule.register({ driver: dbDriver }),
      { bufferLogs: true },
    );

    const logger = app.get(Logger);
    app.useLogger(logger);

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

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    if (swaggerEnabled) {
      logger.log(`📚 Swagger documentation at: http://localhost:${port}/api`);
    }
  } catch (error) {
    console.error('❌ Application failed to start', error);
    process.exit(1);
  }
}

bootstrap().catch((error: unknown) => {
  console.error('❌ Unhandled bootstrap error', error);
  process.exit(1);
});
