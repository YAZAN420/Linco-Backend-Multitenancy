import { BadRequestException } from '@nestjs/common';

export class InvalidEmailFormatException extends BadRequestException {
  constructor() {
    super('errors.INVALID_EMAIL_FORMAT');
  }
}
