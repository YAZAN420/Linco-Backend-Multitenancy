import { BadRequestException } from '@nestjs/common';

export class VerificationTokenExpiredException extends BadRequestException {
  constructor() {
    super('Verification token has expired');
  }
}
