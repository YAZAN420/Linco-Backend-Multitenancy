import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { InvitationsCommandService } from 'src/demos/application/invitation/invitations-command.service';
import { InvitationResponseMapper } from '../mappers/invitation-response.mapper';
import { CreateInvitationDto } from '../dto/invitation/create-invitation.dto';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { InvitationsQueryService } from 'src/demos/application/invitation/invitations-query.service';

@ApiTags('Invitation')
@Controller('invitations')
export class InvitationsCommandController {
  constructor(
    private readonly invitationCommandService: InvitationsCommandService,
    private readonly invitationQueryService: InvitationsQueryService,
    private readonly invitationResponseMapper: InvitationResponseMapper,
  ) {}

  @Post()
  @UseGuards(DemoRolesGuard)
  async create(
    @ActiveDemoMember() demoMember: ActiveDemoMemberData,
    @Body() dto: CreateInvitationDto,
  ) {
    const createdInvitation = await this.invitationCommandService.create({
      senderId: demoMember.userId,
      demoId: demoMember.demoId,
      ...dto,
    });

    const invitation = await this.invitationQueryService.findById(
      createdInvitation.id,
    );

    return {
      message: 'Invitation created successfully',
      data: this.invitationResponseMapper.toResponseFromPrisma(invitation),
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
  @UseGuards(DemoRolesGuard)
  async remove(@Param('invitationId') invitationId: string) {
    await this.invitationCommandService.remove(invitationId);

    return {
      message: 'Invitation deleted successfully',
      data: null,
    };
  }
}
