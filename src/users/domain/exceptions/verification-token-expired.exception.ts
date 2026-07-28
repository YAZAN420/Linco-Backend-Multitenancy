import { BadRequestException } from '@nestjs/common';

export class VerificationTokenExpiredException extends BadRequestException {
  constructor() {
    super('errors.VERIFICATION_TOKEN_HAS_EXPIRED');
  }
}
