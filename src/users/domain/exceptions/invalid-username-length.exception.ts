import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameLengthException extends BadRequestException {
  constructor() {
    super('Username must be between 3 and 20 characters');
  }
}
