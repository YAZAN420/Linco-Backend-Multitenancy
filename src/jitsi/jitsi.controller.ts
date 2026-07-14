import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { JitsiService } from './jitsi.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Jitsi')
@Controller('jitsi')
export class JitsiController {
  constructor(private readonly jitsiService: JitsiService) {}

  @Get('token')
  getMeetingToken(
    @Query('roomName') roomName: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    if (!roomName) {
      throw new BadRequestException('Room name is required');
    }
    return this.jitsiService.generateJitsiToken(user, roomName);
  }
}
