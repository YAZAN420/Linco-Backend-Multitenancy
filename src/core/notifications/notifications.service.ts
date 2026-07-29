import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
} from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';
import { NotificationsPort } from './notifications.port';

@Injectable()
export class FirebaseNotificationsAdapter
  implements NotificationsPort, OnModuleInit
{
  private readonly logger = new Logger(FirebaseNotificationsAdapter.name);

  onModuleInit() {
    if (getApps().length === 0) {
      const filePath = path.join(process.cwd(), 'linco-firebase.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const serviceAccount = JSON.parse(fileContent) as ServiceAccount;

      initializeApp({
        credential: cert(serviceAccount),
      });

      this.logger.log('🔥 Firebase Admin SDK Initialized Successfully');
    }
  }

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<any> {
    if (!token) return;

    const message: Message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    try {
      return await getMessaging().send(message);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to token: ${token}`,
        error,
      );
      throw error;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<any> {
    if (!tokens || tokens.length === 0) return;

    const message: MulticastMessage = {
      tokens,
      notification: { title, body },
      data: data || {},
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message);
      this.logger.log(
        `Sent notifications: ${response.successCount} success, ${response.failureCount} failed`,
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to send multicast notifications', error);
      throw error;
    }
  }
}
