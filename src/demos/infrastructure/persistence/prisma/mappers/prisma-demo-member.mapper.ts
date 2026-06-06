import { Injectable } from '@nestjs/common';
import { DemoMember } from 'src/demos/domain/demo-member';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { DemoMember as PrismaDemoMember } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDemoMemberMapper {
  toDomain(raw: PrismaDemoMember): DemoMember {
    return new DemoMember(raw.id, {
      demoId: raw.demoId,
      userId: raw.userId,
      role: raw.role as DemoMemberRole,
      joinedAt: raw.joinedAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(member: DemoMember): PrismaDemoMember {
    return {
      id: member.id,
      demoId: member.demoId,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      updatedAt: member.updatedAt,
    };
  }
}
