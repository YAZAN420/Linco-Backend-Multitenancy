import { DemoMemberRole } from './enums/demo-member-role.enum';
import { InvitationStatus } from './enums/invitation-status.enum';
import { InvitationProps } from './interfaces/invitation.props';

export class Invitation {
  constructor(
    public readonly id: string,
    private readonly props: InvitationProps,
  ) {}

  get demoId(): string {
    return this.props.demoId;
  }

  get receiverId(): string {
    return this.props.receiverId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get role(): DemoMemberRole {
    return this.props.role;
  }

  get status(): InvitationStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateStatus(newStatus: InvitationStatus): void {
    if (this.props.status === newStatus) return;
    this.props.status = newStatus;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
