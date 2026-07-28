import { Body, Controller, Post } from '@nestjs/common';
import { TwoFactorAuthService } from '../../../application/services/two-factor-auth.service';
import { ActiveUser } from '../decorators/active-user.decorator';
import type { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { TurnOn2FADto } from '../dto/turn-on-2fa.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('authentication/2fa')
export class TwoFactorAuthController {
  constructor(private readonly twoFactorService: TwoFactorAuthService) {}

  @Post('generate')
  async asyncgenerateQrCode(@ActiveUser() user: ActiveUserData) {
    const secret = await this.twoFactorService.generateSecret(user);
    return {
      message: 'messages.QR_CODE_GENERATED_SUCCESSFULLY',
      data: secret,
    };
  }

  @Post('turn-on')
  async turnOn(@ActiveUser() user: ActiveUserData, @Body() dto: TurnOn2FADto) {
    await this.twoFactorService.turnOn(user.id, dto.tfaCode);
    return {
      message: 'messages.TWO_FACTOR_AUTHENTICATION_SUCCESSFULLY_ENABLED',
      data: null,
    };
  }

  @Post('turn-off')
  async turnOff(@ActiveUser() user: ActiveUserData) {
    await this.twoFactorService.turnOff(user.id);

    return {
      message: 'messages.TWO_FACTOR_AUTHENTICATION_SUCCESSFULLY_DISABLED',
      data: null,
    };
  }
}
