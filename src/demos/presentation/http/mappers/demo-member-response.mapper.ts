import { Injectable } from '@nestjs/common';
import { DemoMember as PrismaDemoMember } from 'src/generated/prisma/client';
import { DemoMemberResponseDto } from '../dto/demo-member-response.dto';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

@Injectable()
export class DemoMemberResponseMapper {
  toResponseFromPrisma(member: PrismaDemoMember): DemoMemberResponseDto {
    return new DemoMemberResponseDto(
      member.id,
      member.demoId,
      member.userId,
      member.role as DemoMemberRole,
      member.joinedAt,
      member.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    members: PrismaDemoMember[],
  ): DemoMemberResponseDto[] {
    return members.map((m) => this.toResponseFromPrisma(m));
  }
}
