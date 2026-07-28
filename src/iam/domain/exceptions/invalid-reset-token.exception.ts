import { BadRequestException } from '@nestjs/common';

export class InvalidResetTokenException extends BadRequestException {
  constructor() {
    super('errors.INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN');
  }
}
