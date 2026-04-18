import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import appConfig from 'src/config/app.config';
import redisConfig from 'src/config/redis.config';
import bullConfig from 'src/config/bull.config';
import { validate } from 'src/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, bullConfig],
      validate: validate,
    }),
  ],
})
export class AppConfigModule {}
