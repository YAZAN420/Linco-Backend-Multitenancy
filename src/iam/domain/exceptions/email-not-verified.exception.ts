import { UnauthorizedException } from '@nestjs/common';

export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super('errors.PLEASE_VERIFY_YOUR_EMAIL_BEFORE_SIGNING_IN');
  }
}
