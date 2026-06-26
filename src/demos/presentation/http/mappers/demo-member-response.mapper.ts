import { Injectable } from '@nestjs/common';
import { DemoMemberResponseDto } from '../dto/demo-member/demo-member-response.dto';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { UserResponseMapper } from 'src/users/presentation/http/mappers/user-response.mapper';

@Injectable()
export class DemoMemberResponseMapper {
  constructor(private readonly userResponseMapper: UserResponseMapper) {}

  toResponseFromPrisma(member: DemoMemberWithUser): DemoMemberResponseDto {
    return new DemoMemberResponseDto(
      member.id,
      member.demoId,
      member.userId,
      member.role as DemoMemberRole,
      member.joinedAt,
      member.updatedAt,
      this.userResponseMapper.toResponseFromPrisma(member.user),
    );
  }

  toResponseManyFromPrisma(
    members: DemoMemberWithUser[],
  ): DemoMemberResponseDto[] {
    return members.map((m) => this.toResponseFromPrisma(m));
  }
}
