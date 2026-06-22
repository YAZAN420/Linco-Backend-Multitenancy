import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'src/common/config/database.config';
import appConfig from 'src/common/config/app.config';
import redisConfig from 'src/common/config/redis.config';
import bullConfig from 'src/common/config/bull.config';
import { validate } from 'src/common/config/env.validation';
import storageConfig from 'src/common/config/storage.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig, bullConfig, storageConfig],
      validate: validate,
    }),
  ],
})
export class AppConfigModule {}
