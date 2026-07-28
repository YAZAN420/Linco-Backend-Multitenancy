import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyVerifiedException extends BadRequestException {
  constructor() {
    super('errors.EMAIL_IS_ALREADY_VERIFIED');
  }
}
