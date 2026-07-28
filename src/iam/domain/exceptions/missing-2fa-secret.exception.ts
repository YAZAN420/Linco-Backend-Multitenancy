import { UnauthorizedException } from '@nestjs/common';

export class Missing2FASecretException extends UnauthorizedException {
  constructor() {
    super('errors.TWO_FACTOR_AUTHENTICATION_SECRET_IS_MISSING');
  }
}
