import { Injectable } from '@nestjs/common';
import { Invitation } from '../invitation';
import { v7 as uuidv7 } from 'uuid';
import { DemoMemberRole } from '../enums/demo-member-role.enum';
import { InvitationStatus } from '../enums/invitation-status.enum';

@Injectable()
export class InvitationFactory {
  public createNew(
    demoId: string,
    senderId: string,
    receiverId: string,
    role: DemoMemberRole,
  ): Invitation {
    const now = new Date();
    return new Invitation(uuidv7(), {
      demoId,
      senderId,
      receiverId,
      role,
      status: InvitationStatus.PENDING,
      createdAt: now,
      updatedAt: now,
    });
  }
}
