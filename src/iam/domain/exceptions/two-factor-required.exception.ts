import { ForbiddenException } from '@nestjs/common';

export class TwoFactorRequiredException extends ForbiddenException {
  constructor() {
    super({
      requires2FA: true,
      message: 'Please provide a two-factor authentication code to continue',
    });
  }
}
