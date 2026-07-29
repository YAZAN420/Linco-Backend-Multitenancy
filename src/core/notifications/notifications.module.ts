import { Global, Module } from '@nestjs/common';
import { FirebaseNotificationsAdapter } from './notifications.service';
import { NotificationsPort } from './notifications.port';

@Global()
@Module({
  providers: [
    {
      provide: NotificationsPort,
      useClass: FirebaseNotificationsAdapter,
    },
  ],
  exports: [NotificationsPort],
})
export class NotificationsModule {}
