import { DemoMemberRole } from './enums/demo-member-role.enum';
import { DemoMemberProps } from './interfaces/demo-member.props';

export class DemoMember {
  constructor(
    public readonly id: string,
    private props: DemoMemberProps,
  ) {}

  get userId(): string {
    return this.props.userId;
  }
  get demoId(): string {
    return this.props.demoId;
  }
  get role(): DemoMemberRole {
    return this.props.role;
  }

  get joinedAt(): Date {
    return this.props.joinedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateRole(newRole: DemoMemberRole): void {
    if (newRole === this.props.role) return;
    this.props.role = newRole;
    this.touch();
  }
  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
