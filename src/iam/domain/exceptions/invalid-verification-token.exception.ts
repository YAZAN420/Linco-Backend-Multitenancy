import { BadRequestException } from '@nestjs/common';

export class InvalidVerificationTokenException extends BadRequestException {
  constructor() {
    super('errors.INVALID_OR_EXPIRED_VERIFICATION_TOKEN');
  }
}
