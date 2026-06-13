import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigType } from '@nestjs/config';
import bullConfig from 'src/common/config/bull.config';

@Module({
  imports: [
    ConfigModule.forFeature(bullConfig),
    BullModule.forRootAsync({
      inject: [bullConfig.KEY],
      useFactory: (bullConfiguration: ConfigType<typeof bullConfig>) =>
        bullConfiguration,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
