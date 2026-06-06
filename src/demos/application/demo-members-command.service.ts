import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DemoCommandRepository } from './ports/demo-command.repository';
import { DemoMemberCommandRepository } from './ports/demo-member-command.repository';
import { DemoMemberFactory } from '../domain/factories/demo-member.factory';
import { CreateDemoMemberInput } from './interfaces/create-demo-member-input.interface';
import { UpdateDemoMemberInput } from './interfaces/update-demo-member-input.interface';

@Injectable()
export class DemoMembersCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly demoMemberFactory: DemoMemberFactory,
  ) {}

  async addMember(demoId: string, input: CreateDemoMemberInput): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    const existing = await this.demoMemberCommandRepository.findByDemoAndUser(
      demoId,
      input.userId,
    );
    if (existing) {
      throw new ConflictException('User is already a member of this demo');
    }

    const count = await this.demoMemberCommandRepository.countByDemo(demoId);
    demo.verifyCanAddMember(count);

    const member = this.demoMemberFactory.createNew(demoId, {
      userId: input.userId,
      role: input.role,
    });
    await this.demoMemberCommandRepository.save(member);
  }

  async updateMemberRole(
    demoId: string,
    userId: string,
    input: UpdateDemoMemberInput,
  ): Promise<void> {
    const member = await this.demoMemberCommandRepository.findByDemoAndUser(
      demoId,
      userId,
    );
    if (!member) throw new NotFoundException('Member not found');

    member.changeRole(input.role);
    await this.demoMemberCommandRepository.save(member);
  }

  async removeMember(demoId: string, userId: string): Promise<void> {
    const member = await this.demoMemberCommandRepository.findByDemoAndUser(
      demoId,
      userId,
    );
    if (!member) throw new NotFoundException('Member not found');

    await this.demoMemberCommandRepository.delete(demoId, userId);
  }
}
