import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameLengthException extends BadRequestException {
  constructor() {
    super('errors.USERNAME_MUST_BE_BETWEEN_3_AND_20_CHARACTERS');
  }
}
