import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { NotificationsService } from '../application/notifications.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';

@Controller('notifications')
export class FcmTokensController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('fcm-token')
  async registerToken(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() dto: RegisterFcmTokenDto,
  ) {
    await this.notificationsService.registerToken(
      activeUser.id,
      dto.token,
      dto.deviceModel,
    );
    return {
      message: 'messages.FCM_TOKEN_REGISTERED_SUCCESSFULLY',
      data: null,
    };
  }

  @Delete('fcm-token/:token')
  async unregisterToken(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('token') token: string,
  ) {
    await this.notificationsService.unregisterToken(activeUser.id, token);
    return { message: 'messages.FCM_TOKEN_REMOVED_SUCCESSFULLY', data: null };
  }
}
