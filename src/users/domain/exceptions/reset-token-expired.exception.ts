import { BadRequestException } from '@nestjs/common';

export class ResetTokenExpiredException extends BadRequestException {
  constructor() {
    super('Reset token has expired');
  }
}
