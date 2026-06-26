import { DemoMember } from 'src/demos/domain/demo-member';

export abstract class DemoMemberCommandRepository {
  abstract save(member: DemoMember): Promise<void>;
  abstract findById(id: string): Promise<DemoMember | null>;
  abstract findByDemoAndUser(
    demoId: string,
    userId: string,
  ): Promise<DemoMember | null>;
  abstract delete(id: string): Promise<void>;
  abstract countByDemo(demoId: string): Promise<number>;
}
