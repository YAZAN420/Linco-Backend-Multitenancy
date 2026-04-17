import { UnauthorizedException } from '@nestjs/common';

export class Invalid2FACodeException extends UnauthorizedException {
  constructor() {
    super('Invalid two-factor authentication code');
  }
}
