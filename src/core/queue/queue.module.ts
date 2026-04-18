import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ConfigType } from '@nestjs/config';
import bullConfig from 'src/config/bull.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [bullConfig.KEY],
      useFactory: (bullConfiguration: ConfigType<typeof bullConfig>) =>
        bullConfiguration,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
