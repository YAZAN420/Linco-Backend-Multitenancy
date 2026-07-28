import { UnauthorizedException } from '@nestjs/common';

export class Invalid2FACodeException extends UnauthorizedException {
  constructor() {
    super('errors.INVALID_TWO_FACTOR_AUTHENTICATION_CODE');
  }
}
