import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameCharactersException extends BadRequestException {
  constructor() {
    super('Username contains invalid characters');
  }
}
