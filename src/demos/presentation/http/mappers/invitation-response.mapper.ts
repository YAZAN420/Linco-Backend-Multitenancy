import { Injectable } from '@nestjs/common';
import { InvitationResponseDto } from '../dto/invitation/invitation-response.dto';
import { Invitation as PrismaInvitation } from 'src/generated/prisma/client';
import { Invitation as DomainInvitation } from 'src/demos/domain/invitation';

@Injectable()
export class InvitationResponseMapper {
  toResponseFromPrisma(invitation: PrismaInvitation): InvitationResponseDto {
    return new InvitationResponseDto(
      invitation.id,
      invitation.createdAt,
      invitation.updatedAt,
    );
  }

  toResponseFromDomain(invitation: DomainInvitation): InvitationResponseDto {
    return new InvitationResponseDto(
      invitation.id,
      invitation.createdAt,
      invitation.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    invitations: PrismaInvitation[],
  ): InvitationResponseDto[] {
    return invitations.map((invitation) =>
      this.toResponseFromPrisma(invitation),
    );
  }
}
