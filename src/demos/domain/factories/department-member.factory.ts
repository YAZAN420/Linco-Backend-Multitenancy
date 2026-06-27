import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { DepartmentMember } from '../department-member';
import { JobTitle } from '../enums/job-title.enum';

@Injectable()
export class DepartmentMemberFactory {
  createNew(
    departmentId: string,
    demoMemberId: string,
    jobTitle: JobTitle,
  ): DepartmentMember {
    const now = new Date();
    return new DepartmentMember(uuidv7(), {
      departmentId,
      demoMemberId,
      jobTitle,
      assignedAt: now,
      updatedAt: now,
    });
  }
}
