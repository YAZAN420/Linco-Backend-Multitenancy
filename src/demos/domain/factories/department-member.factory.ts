import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { DepartmentMember } from '../department-member';
import { JobTitle } from '../enums/job-title.enum';
import { DepartmentMemberRole } from '../enums/department-member-role.enum copy';

@Injectable()
export class DepartmentMemberFactory {
  createNew(
    departmentId: string,
    demoMemberId: string,
    role: DepartmentMemberRole,
    jobTitle: JobTitle,
  ): DepartmentMember {
    const now = new Date();
    return new DepartmentMember(uuidv7(), {
      departmentId,
      demoMemberId,
      role,
      jobTitle,
      assignedAt: now,
      updatedAt: now,
    });
  }
}
