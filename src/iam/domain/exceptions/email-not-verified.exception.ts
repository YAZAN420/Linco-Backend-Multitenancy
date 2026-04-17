import { UnauthorizedException } from '@nestjs/common';

export class EmailNotVerifiedException extends UnauthorizedException {
  constructor() {
    super('Please verify your email before signing in');
  }
}
