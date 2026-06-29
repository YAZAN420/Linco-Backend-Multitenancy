import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

export function setupApp(app: INestApplication): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : !isProduction,
    credentials: true,
  });
  app.use(cookieParser());
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
