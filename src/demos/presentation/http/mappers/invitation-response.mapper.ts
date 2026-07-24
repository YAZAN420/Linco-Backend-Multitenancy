import { Injectable } from '@nestjs/common';
import { InvitationResponseDto } from '../dto/invitation/invitation-response.dto';

import { InvitationStatus } from 'src/demos/domain/enums/invitation-status.enum';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { InvitationWithUserAndDemo } from 'src/core/database/prisma/types';
import { DemoResponseMapper } from './demo-response.mapper';
import { UserResponseMapper } from 'src/users/presentation/http/mappers/user-response.mapper';

@Injectable()
export class InvitationResponseMapper {
  constructor(
    private readonly demoResponseMapper: DemoResponseMapper,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}
  toResponseFromPrisma(
    invitation: InvitationWithUserAndDemo,
  ): InvitationResponseDto {
    return new InvitationResponseDto(
      invitation.id,
      invitation.status as InvitationStatus,
      invitation.role as DemoMemberRole,
      invitation.createdAt,
      invitation.updatedAt,
      this.demoResponseMapper.toSimpleResponseFromPrisma(invitation.demo),
      this.userResponseMapper.toPublicResponseFromPrisma(invitation.sender),
    );
  }

  toResponseManyFromPrisma(
    invitations: InvitationWithUserAndDemo[],
  ): InvitationResponseDto[] {
    return invitations.map((invitation) =>
      this.toResponseFromPrisma(invitation),
    );
  }
}
