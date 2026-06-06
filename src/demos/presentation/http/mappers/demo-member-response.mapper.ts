import { Injectable } from '@nestjs/common';
import { DemoMember as PrismaDemoMember } from 'src/generated/prisma/client';
import { DemoMemberResponseDto } from '../dto/demo-member-respomse.dto';

@Injectable()
export class DemoMemberResponseMapper {
  toResponseFromPrisma(member: PrismaDemoMember): DemoMemberResponseDto {
    return {
      id: member.id,
      demoId: member.demoId,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      updatedAt: member.updatedAt,
    };
  }

  toResponseManyFromPrisma(
    members: PrismaDemoMember[],
  ): DemoMemberResponseDto[] {
    return members.map((m) => this.toResponseFromPrisma(m));
  }
}
