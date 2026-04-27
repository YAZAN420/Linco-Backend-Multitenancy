import { BadRequestException } from '@nestjs/common';

export class EmailNotVerifiedFor2FAException extends BadRequestException {
  constructor() {
    super('Email must be verified before enabling 2FA');
  }
}
