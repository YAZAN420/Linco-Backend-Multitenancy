import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

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
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    setupApp(app);

    setupSwagger(app);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);

    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger documentation at: http://localhost:${port}/api`);
  } catch (error) {
    console.error('❌ Application failed to start', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => console.log(err));
