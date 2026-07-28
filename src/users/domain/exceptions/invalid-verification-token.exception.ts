import { BadRequestException } from '@nestjs/common';

export class InvalidVerificationTokenException extends BadRequestException {
  constructor() {
    super('errors.INVALID_VERIFICATION_TOKEN');
  }
}
