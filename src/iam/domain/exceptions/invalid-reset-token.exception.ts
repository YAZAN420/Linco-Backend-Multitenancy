import { BadRequestException } from '@nestjs/common';

export class InvalidResetTokenException extends BadRequestException {
  constructor() {
    super('Invalid or expired password reset token');
  }
}
