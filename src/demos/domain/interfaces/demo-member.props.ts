import { DemoMemberRole } from '../enums/demo-member-role.enum';

export interface DemoMemberProps {
  userId: string;
  demoId: string;
  role: DemoMemberRole;
  joinedAt: Date;
  updatedAt: Date;
}
