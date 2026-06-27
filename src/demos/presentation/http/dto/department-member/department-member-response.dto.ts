import { JobTitle } from 'src/demos/domain/enums/job-title.enum';

export class DepartmentMemberResponseDto {
  constructor(
    readonly id: string,
    readonly demoMemberId: string,
    readonly departmentId: string,
    readonly jobTitle: JobTitle,
    readonly assignedAt: Date,
    readonly updatedAt: Date,
  ) {}
}
