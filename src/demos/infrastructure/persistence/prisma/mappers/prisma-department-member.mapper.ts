import { Injectable } from '@nestjs/common';
import { DepartmentMember } from 'src/demos/domain/department-member';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';
import { DepartmentMember as PrismaDepartmentMember } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDepartmentMemberMapper {
  toDomain(raw: PrismaDepartmentMember): DepartmentMember {
    return new DepartmentMember(raw.id, {
      departmentId: raw.departmentId,
      demoMemberId: raw.demoMemberId,
      jobTitle: raw.jobTitle as JobTitle,
      assignedAt: raw.assignedAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(member: DepartmentMember): PrismaDepartmentMember {
    return {
      id: member.id,
      departmentId: member.departmentId,
      demoMemberId: member.demoMemberId,
      jobTitle: member.jobTitle,
      assignedAt: member.assignedAt,
      updatedAt: member.updatedAt,
    };
  }
}
