import { Controller, Get, Query } from '@nestjs/common';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { VerifyEmailDto } from '../dto/verify-email.dto';

@Controller('authentication')
export class EmailVerificationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    await this.registrationService.verifyEmail(dto.token);
    return { message: 'Email verified successfully.' };
  }
}
