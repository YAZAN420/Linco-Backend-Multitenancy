import { Injectable } from '@nestjs/common';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { Invitation } from 'src/demos/domain/invitation';
import { InvitationStatus } from 'src/demos/domain/enums/invitation-status.enum';
import type { Invitation as PrismaInvitation } from 'src/generated/prisma/client';

@Injectable()
export class PrismaInvitationMapper {
  toDomain(raw: PrismaInvitation): Invitation {
    return new Invitation(raw.id, {
      demoId: raw.demoId,
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      role: raw.role as DemoMemberRole,
      status: raw.status as InvitationStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(invitation: Invitation): PrismaInvitation {
    return {
      id: invitation.id,
      demoId: invitation.demoId,
      senderId: invitation.senderId,
      receiverId: invitation.receiverId,
      role: invitation.role,
      status: invitation.status,
      createdAt: invitation.createdAt,
      updatedAt: invitation.updatedAt,
    };
  }
}
