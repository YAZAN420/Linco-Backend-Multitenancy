import { Controller, Post, Body, Param, Delete } from '@nestjs/common';

import { InvitationsCommandService } from 'src/demos/application/invitation/invitations-command.service';
import { InvitationResponseMapper } from '../mappers/invitation-response.mapper';
import { CreateInvitationDto } from '../dto/invitation/create-invitation.dto';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Controller('demos/:demoId/invitations')
export class InvitationsCommandController {
  constructor(
    private readonly invitationCommandService: InvitationsCommandService,
    private readonly invitationResponseMapper: InvitationResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('demoId') demoId: string,
    @ActiveUser() user: ActiveUserData,
    @Body() dto: CreateInvitationDto,
  ) {
    const invitation = await this.invitationCommandService.create(demoId, {
      senderId: user.id,
      ...dto,
    });

    return {
      message: 'Invitation created successfully',
      data: this.invitationResponseMapper.toResponseFromDomain(invitation),
    };
  }

  @Post(':invitationId/accept')
  async accept(
    @Param('invitationId') invitationId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    await this.invitationCommandService.accept(invitationId, user.id);
    return { message: 'Invitation accepted successfully', data: null };
  }

  @Post(':invitationId/reject')
  async reject(
    @Param('invitationId') invitationId: string,
    @ActiveUser() user: ActiveUserData,
  ) {
    await this.invitationCommandService.reject(invitationId, user.id);
    return { message: 'Invitation rejected successfully', data: null };
  }

  @Delete(':invitationId')
  async remove(
    @Param('demoId') demoId: string,
    @Param('invitationId') invitationId: string,
  ) {
    await this.invitationCommandService.remove(invitationId);

    return {
      message: 'Invitation deleted successfully',
      data: null,
    };
  }
}
