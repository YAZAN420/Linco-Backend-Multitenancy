import { Body, Controller, Post } from '@nestjs/common';
import { PasswordManagementService } from '../../../application/services/password-management.service';
import { Public } from '../decorators/public.decorator';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication')
export class PasswordController {
  constructor(private readonly passwordService: PasswordManagementService) {}

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.passwordService.forgotPassword(dto.email);
    return {
      message: 'messages.PASSWORD_RESET_LINK_SENT_IF_ACCOUNT_EXISTS',
      data: null,
    };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.passwordService.resetPassword(dto.token, dto.password);
    return { message: 'messages.PASSWORD_HAS_BEEN_RESET_SUCCESSFULLY', data: null };
  }

  @Post('change-password')
  async changePassword(
    @ActiveUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.passwordService.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
    return { message: 'messages.PASSWORD_UPDATED_SUCCESSFULLY', data: null };
  }
}
