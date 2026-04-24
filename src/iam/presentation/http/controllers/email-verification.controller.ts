import { Controller, Get, Query } from '@nestjs/common';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Controller('authentication')
export class EmailVerificationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Public()
  @Get('verify-email')
  verifyEmail(@Query() dto: VerifyEmailDto) {
    return this.registrationService.verifyEmail(dto.token);
  }
}
