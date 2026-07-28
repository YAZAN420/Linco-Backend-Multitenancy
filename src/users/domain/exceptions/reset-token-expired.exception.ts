import { BadRequestException } from '@nestjs/common';

export class ResetTokenExpiredException extends BadRequestException {
  constructor() {
    super('errors.RESET_TOKEN_HAS_EXPIRED');
  }
}
