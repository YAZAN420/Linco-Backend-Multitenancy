import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from 'firebase-admin/app';
import {
  getMessaging,
  Message,
  MulticastMessage,
  BatchResponse,
} from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';
import { NotificationsPort } from '../../application/ports/notifications.port';

@Injectable()
export class FirebaseNotificationsAdapter
  implements NotificationsPort, OnModuleInit
{
  private readonly logger = new Logger(FirebaseNotificationsAdapter.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    if (getApps().length > 0) return;

    try {
      const credentialPath =
        this.configService.get<string>('FIREBASE_CREDENTIALS_PATH') ||
        path.join(process.cwd(), 'linco-firebase.json');

      if (!fs.existsSync(credentialPath)) {
        this.logger.error(
          `❌ Firebase credentials file not found at: ${credentialPath}`,
        );
        return;
      }

      const fileContent = fs.readFileSync(credentialPath, 'utf8');
      const serviceAccount = JSON.parse(fileContent) as ServiceAccount;

      initializeApp({ credential: cert(serviceAccount) });
      this.logger.log('🔥 Firebase Admin SDK Initialized Successfully');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Firebase Admin SDK', error);
    }
  }

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<string | null> {
    if (!token?.trim()) return null;

    const message: Message = { token, notification: { title, body }, data };

    try {
      return await getMessaging().send(message);
    } catch (error) {
      this.logger.error(`Failed to send notification to device`, error);
      throw error;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<BatchResponse | null> {
    const validTokens = tokens?.filter((t) => Boolean(t?.trim())) || [];
    if (validTokens.length === 0) return null;

    const message: MulticastMessage = {
      tokens: validTokens,
      notification: { title, body },
      data,
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message);
      this.logger.log(
        `Multicast sent: ${response.successCount} succeeded, ${response.failureCount} failed`,
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to send multicast notifications', error);
      throw error;
    }
  }
}
