import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { DemoMember } from '../demo-member';

@Injectable()
export class DemoMemberFactory {
  createNew(demoId: string, userId: string, role: string): DemoMember {
    const now = new Date();
    return new DemoMember(uuidv7(), {
      demoId,
      userId,
      role,
      createdAt: now,
      updatedAt: now,
    });
  }
}
