import { JobTitle } from 'src/demos/domain/enums/job-title.enum';
import { DemoMemberResponseDto } from '../demo-member/demo-member-response.dto';

export class DepartmentMemberResponseDto {
  constructor(
    readonly id: string,
    readonly departmentId: string,
    readonly jobTitle: JobTitle,
    readonly assignedAt: Date,
    readonly updatedAt: Date,
    readonly demoMember?: DemoMemberResponseDto,
  ) {}
}
