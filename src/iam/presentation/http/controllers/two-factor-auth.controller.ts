import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TwoFactorAuthService } from '../../../application/services/two-factor-auth.service';
import { ActiveUser } from '../decorators/active-user.decorator';
import type { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { TurnOn2FADto } from '../dto/turn-on-2fa.dto';

@Controller('authentication/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorService: TwoFactorAuthService) {}

  @Post('generate')
  async asyncgenerateQrCode(@ActiveUser() user: ActiveUserData) {
    const secret = await this.twoFactorService.generateSecret(user);
    return {
      message: 'qrcode generated successfully',
      data: secret,
    };
  }

  @Post('turn-on')
  @HttpCode(HttpStatus.OK)
  async turnOn(@ActiveUser() user: ActiveUserData, @Body() dto: TurnOn2FADto) {
    await this.twoFactorService.turnOn(user.id, dto.tfaCode);
    return {
      message: 'Two-factor authentication successfully enabled',
    };
  }
}
