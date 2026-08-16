import { Injectable } from '@nestjs/common';
import { DepartmentMemberWithUser } from 'src/core/database/prisma/types';
import { DepartmentMemberResponseDto } from '../dto/department-member/department-member-response.dto';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';
import { DemoMemberResponseMapper } from './demo-member-response.mapper';

@Injectable()
export class DepartmentMemberResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}

  toResponseFromPrisma(
    member: DepartmentMemberWithUser,
  ): DepartmentMemberResponseDto {
    return new DepartmentMemberResponseDto(
      member.id,
      member.demoMemberId,
      member.jobTitle as JobTitle,
      member.assignedAt,
      member.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(member.demoMember),
    );
  }

  toResponseManyFromPrisma(
    members: DepartmentMemberWithUser[],
  ): DepartmentMemberResponseDto[] {
    return members.map((m) => this.toResponseFromPrisma(m));
  }
}
