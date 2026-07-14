import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendVerificationEmailDto } from '../dto/resend-verification-email.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class EmailVerificationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    await this.registrationService.verifyEmail(dto.token);
    return { message: 'Email verified successfully.', data: null };
  }

  @Public()
  @Post('resend-verification-email')
  async resendVerificationEmail(@Body() dto: ResendVerificationEmailDto) {
    await this.registrationService.resendVerificationEmail(dto.email);
    return {
      message:
        'If the email is registered and not verified, a new verification link has been sent.',
      data: null,
    };
  }
}
