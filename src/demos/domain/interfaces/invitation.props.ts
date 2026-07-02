import { DemoMemberRole } from '../enums/demo-member-role.enum';
import { InvitationStatus } from '../enums/invitation-status.enum';

export interface InvitationProps {
  demoId: string;
  receiverId: string;
  senderId: string;
  role: DemoMemberRole;
  status: InvitationStatus;
  createdAt: Date;
  updatedAt: Date;
}
