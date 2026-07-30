import { Injectable, Logger } from '@nestjs/common';
import { NotificationsPort } from './ports/notifications.port';
import { FcmTokenRepository } from './ports/fcm-token.repository.port';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsAdapter: NotificationsPort,
    private readonly fcmTokenRepository: FcmTokenRepository,
  ) {}

  async registerToken(
    userId: string,
    token: string,
    deviceModel?: string,
  ): Promise<void> {
    await this.fcmTokenRepository.saveFcmToken(userId, token, deviceModel);
  }

  async unregisterToken(userId: string, token: string): Promise<void> {
    await this.fcmTokenRepository.deleteFcmToken(userId, token);
  }

  async sendToUser(
    userId: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<void> {
    const tokens = await this.fcmTokenRepository.findFcmTokensByUserId(userId);
    if (!tokens || tokens.length === 0) return;

    const response = await this.notificationsAdapter.sendToMultipleDevices(
      tokens,
      title,
      body,
      data,
    );

    if (response && response.failureCount > 0) {
      const invalidTokens: string[] = [];

      response.responses.forEach((res, index) => {
        if (!res.success) {
          const errorCode = res.error?.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokens[index]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        this.logger.warn(
          `Cleaning up ${invalidTokens.length} invalid FCM tokens for user: ${userId}`,
        );
        await this.fcmTokenRepository.deleteInvalidFcmTokens(invalidTokens);
      }
    }
  }
}
