import { Body, Controller, Post } from '@nestjs/common';
import { TwoFactorAuthService } from '../../../application/services/two-factor-auth.service';
import { ActiveUser } from '../decorators/active-user.decorator';
import { AuthTurnOn2FA } from '../decorators/authentication.decorators';
import type { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { TurnOn2FADto } from '../dto/turn-on-2fa.dto';

@Controller('authentication/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorService: TwoFactorAuthService) {}

  @Post('generate')
  async asyncgenerateQrCode(@ActiveUser() user: ActiveUserData) {
    return {
      message: 'qrcode generated successfully',
      data: await this.twoFactorService.generateSecret(user),
    };
  }

  @AuthTurnOn2FA()
  async turnOn(@ActiveUser() user: ActiveUserData, @Body() dto: TurnOn2FADto) {
    const response = await this.twoFactorService.turnOn(user.id, dto.tfaCode);
    return {
      message: response.message,
    };
  }
}
