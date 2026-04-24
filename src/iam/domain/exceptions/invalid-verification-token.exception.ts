import { BadRequestException } from '@nestjs/common';

export class InvalidVerificationTokenException extends BadRequestException {
  constructor() {
    super('Invalid or expired verification token');
  }
}
