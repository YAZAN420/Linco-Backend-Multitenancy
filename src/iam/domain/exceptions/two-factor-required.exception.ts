import { ForbiddenException } from '@nestjs/common';

export class TwoFactorRequiredException extends ForbiddenException {
  constructor() {
    super({
      requires2FA: true,
      message:
        'errors.PLEASE_PROVIDE_A_TWO_FACTOR_AUTHENTICATION_CODE_TO_CONTINUE',
    });
  }
}
