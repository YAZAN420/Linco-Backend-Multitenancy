import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameCharactersException extends BadRequestException {
  constructor() {
    super('errors.USERNAME_CONTAINS_INVALID_CHARACTERS');
  }
}
