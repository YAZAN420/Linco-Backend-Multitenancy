import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { DemoMember } from '../demo-member';
import { CreateDemoMemberInput } from 'src/demos/application/interfaces/create-demo-member-input.interface';

@Injectable()
export class DemoMemberFactory {
  createNew(demoId: string, input: CreateDemoMemberInput): DemoMember {
    const now = new Date();
    return new DemoMember(uuidv7(), {
      demoId: demoId,
      userId: input.userId,
      role: input.role,
      joinedAt: now,
      updatedAt: now,
    });
  }
}
