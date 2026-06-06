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
  get role(): string {
    return this.props.role;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
