import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export interface CreateInvitationInput {
  senderId: string;
  receiverId: string;
  demoId: string;
  role: DemoMemberRole;
}
