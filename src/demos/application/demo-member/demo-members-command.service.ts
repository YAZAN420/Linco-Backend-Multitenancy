import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DemoCommandRepository } from '../ports/demo/demo-command.repository';
import { DemoMemberCommandRepository } from '../ports/demo-member/demo-member-command.repository';
import { DemoMemberFactory } from 'src/demos/domain/factories/demo-member.factory';
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
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    const existing = await this.demoMemberCommandRepository.findByDemoAndUser(
      demoId,
      input.userId,
    );
    if (existing) {
      throw new ConflictException('errors.USER_IS_ALREADY_A_MEMBER_OF_THIS_DEMO');
    }

    const count = await this.demoMemberCommandRepository.countByDemo(demoId);
    demo.verifyCanAddMember(count);

    const member = this.demoMemberFactory.createNew(
      demoId,
      input.userId,
      input.role,
    );
    await this.demoMemberCommandRepository.save(member);
  }

  async updateMemberRole(
    demoId: string,
    memberId: string,
    input: UpdateDemoMemberInput,
  ): Promise<void> {
    const member = await this.demoMemberCommandRepository.findById(memberId);
    if (!member) throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    if (member.demoId !== demoId)
      throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    if (input.role) member.updateRole(input.role);
    await this.demoMemberCommandRepository.save(member);
  }

  async removeMember(demoId: string, memberId: string): Promise<void> {
    const member = await this.demoMemberCommandRepository.findById(memberId);

    if (!member) throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    if (member.demoId !== demoId)
      throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    await this.demoMemberCommandRepository.delete(memberId);
  }
}
