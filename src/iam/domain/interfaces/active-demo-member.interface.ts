import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export interface ActiveDemoMemberData {
  id: string;
  userId: string;
  demoId: string;
  role: DemoMemberRole;
}
