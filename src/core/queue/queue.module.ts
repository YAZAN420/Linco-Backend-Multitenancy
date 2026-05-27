import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigType } from '@nestjs/config';
import bullConfig from 'src/config/bull.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [bullConfig.KEY],
      useFactory: (bullConfiguration: ConfigType<typeof bullConfig>) =>
        bullConfiguration,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
