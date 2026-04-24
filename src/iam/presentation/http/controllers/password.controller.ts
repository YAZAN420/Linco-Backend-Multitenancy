import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordManagementService } from '../../../application/services/password-management.service';
import { Public } from '../decorators/public.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('authentication')
export class PasswordController {
  constructor(private readonly passwordService: PasswordManagementService) {}

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordService.resetPassword(dto.token, dto.password);
  }
}
