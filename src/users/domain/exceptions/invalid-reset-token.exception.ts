import { BadRequestException } from '@nestjs/common';

export class InvalidResetTokenException extends BadRequestException {
  constructor() {
    super('errors.INVALID_RESET_TOKEN');
  }
}
