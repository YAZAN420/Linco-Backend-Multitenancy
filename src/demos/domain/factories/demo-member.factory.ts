import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { DemoMember } from '../demo-member';
import { DemoMemberRole } from '../enums/demo-member-role.enum';

@Injectable()
export class DemoMemberFactory {
  createNew(demoId: string, userId: string, role: DemoMemberRole): DemoMember {
    const now = new Date();
    return new DemoMember(uuidv7(), {
      demoId: demoId,
      userId,
      role,
      joinedAt: now,
      updatedAt: now,
    });
  }
}
