import { DepartmentMemberRole } from './enums/department-member-role.enum';
import { JobTitle } from './enums/job-title.enum';
import { DepartmentMemberProps } from './interfaces/department-member.props';

export class DepartmentMember {
  constructor(
    public readonly id: string,
    private props: DepartmentMemberProps,
  ) {}

  get departmentId(): string {
    return this.props.departmentId;
  }

  get demoMemberId(): string {
    return this.props.demoMemberId;
  }

  get role(): DepartmentMemberRole {
    return this.props.role;
  }

  get jobTitle(): JobTitle {
    return this.props.jobTitle;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateJobTitle(newJobTitle: JobTitle) {
    if (this.props.jobTitle === newJobTitle) return;
    this.props.jobTitle = newJobTitle;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
