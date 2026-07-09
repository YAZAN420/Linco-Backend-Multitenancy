import { Controller, Get, Param, Query } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { InvitationsQueryService } from 'src/demos/application/invitation/invitations-query.service';
import { InvitationResponseMapper } from '../mappers/invitation-response.mapper';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Controller('invitations')
export class InvitationsQueryController {
  constructor(
    private readonly invitationQueryService: InvitationsQueryService,
    private readonly invitationResponseMapper: InvitationResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @ActiveUser() user: ActiveUserData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const invitations = await this.invitationQueryService.findAllCursor(
      user.id,
      options,
    );

    return {
      message: 'Invitations fetched successfully',
      data: this.invitationResponseMapper.toResponseManyFromPrisma(
        invitations.data,
      ),
      meta: invitations.meta,
    };
  }

  @Get(':invitationId')
  async findOne(@Param('invitationId') invitationId: string) {
    const invitation = await this.invitationQueryService.findById(invitationId);

    return {
      message: 'Invitation retrieved successfully',
      data: this.invitationResponseMapper.toResponseFromPrisma(invitation),
    };
  }
}
