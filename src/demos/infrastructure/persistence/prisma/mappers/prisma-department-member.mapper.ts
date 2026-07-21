import { Injectable } from '@nestjs/common';
import { DepartmentMember } from 'src/demos/domain/department-member';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';
import { DepartmentMember as PrismaDepartmentMember } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDepartmentMemberMapper {
  toDomain(raw: PrismaDepartmentMember): DepartmentMember {
    return new DepartmentMember(raw.id, {
      departmentId: raw.departmentId,
      demoMemberId: raw.demoMemberId,
      role: raw.role as DepartmentMemberRole,
      jobTitle: raw.jobTitle as JobTitle,
      assignedAt: raw.assignedAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(member: DepartmentMember): PrismaDepartmentMember {
    return {
      id: member.id,
      departmentId: member.departmentId,
      role: member.role,
      demoMemberId: member.demoMemberId,
      jobTitle: member.jobTitle,
      assignedAt: member.assignedAt,
      updatedAt: member.updatedAt,
    };
  }
}
