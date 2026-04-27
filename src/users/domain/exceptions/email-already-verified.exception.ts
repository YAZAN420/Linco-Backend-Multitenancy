import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyVerifiedException extends BadRequestException {
  constructor() {
    super('Email is already verified');
  }
}
