import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export interface CreateDemoMemberInput {
  userId: string;
  role: DemoMemberRole;
}
