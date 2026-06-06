import { DemoMember } from 'src/demos/domain/demo-member';

export abstract class DemoMemberCommandRepository {
  abstract save(member: DemoMember): Promise<void>;
  abstract delete(demoId: string, userId: string): Promise<void>;
  abstract findByDemoAndUser(
    demoId: string,
    userId: string,
  ): Promise<DemoMember | null>;
  abstract countByDemo(demoId: string): Promise<number>;
}
