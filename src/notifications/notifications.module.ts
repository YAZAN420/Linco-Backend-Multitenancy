import { Module } from '@nestjs/common';
import { NotificationsService } from './application/notifications.service';
import { FcmTokensController } from './presentation/fcm-tokens.controller';

import { FirebaseNotificationsAdapter } from './infrastructure/adapters/firebase-notifications.adapter';
import { PrismaFcmTokenRepository } from './infrastructure/persistence/prisma-fcm-token.repository';
import { FcmTokenRepository } from './application/ports/fcm-token.repository.port';
import { NotificationsPort } from './application/ports/notifications.port';

@Module({
  controllers: [FcmTokensController],
  providers: [
    NotificationsService,
    {
      provide: NotificationsPort,
      useClass: FirebaseNotificationsAdapter,
    },
    {
      provide: FcmTokenRepository,
      useClass: PrismaFcmTokenRepository,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
