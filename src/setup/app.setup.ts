import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getCorsOrigins } from 'src/common/config/cors.config';

export function setupApp(app: INestApplication): void {
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
