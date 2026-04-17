import { UnauthorizedException } from '@nestjs/common';

export class Missing2FASecretException extends UnauthorizedException {
  constructor() {
    super('Two-factor authentication secret is missing');
  }
}
