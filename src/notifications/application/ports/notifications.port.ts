import { BatchResponse } from 'firebase-admin/messaging';

export abstract class NotificationsPort {
  abstract sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<string | null>;

  abstract sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<BatchResponse | null>;
}
