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

  changeRole(newRole: DemoMemberRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }
}
