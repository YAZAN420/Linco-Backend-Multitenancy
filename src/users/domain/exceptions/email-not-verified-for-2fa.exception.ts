import { BadRequestException } from '@nestjs/common';

export class EmailNotVerifiedFor2FAException extends BadRequestException {
  constructor() {
    super('errors.EMAIL_MUST_BE_VERIFIED_BEFORE_ENABLING_2_FA');
  }
}
