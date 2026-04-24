export abstract class CryptoPort {
  abstract generateSecureToken(): string;
  abstract hashToken(token: string): string;
}
