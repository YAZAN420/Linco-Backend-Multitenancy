export abstract class FcmTokenRepository {
  abstract saveFcmToken(
    userId: string,
    token: string,
    deviceModel?: string,
  ): Promise<void>;
  abstract deleteFcmToken(userId: string, token: string): Promise<void>;
  abstract findFcmTokensByUserId(userId: string): Promise<string[]>;
  abstract deleteInvalidFcmTokens(tokens: string[]): Promise<void>;
}
