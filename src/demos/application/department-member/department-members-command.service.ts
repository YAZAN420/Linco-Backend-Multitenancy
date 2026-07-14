import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMemberFactory } from 'src/demos/domain/factories/department-member.factory';
import { DepartmentMemberCommandRepository } from '../ports/department-member/department-member-command.repository';
import { CreateDepartmentMemberInput } from './interfaces/create-department-member-input.interface';
import { UpdateDepartmentMemberInput } from './interfaces/update-department-member-input.interface';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum copy';

@Injectable()
export class DepartmentMembersCommandService {
  constructor(
    private readonly demoQueryRepository: DemoQueryRepository,
    private readonly departmentMemberCommandRepository: DepartmentMemberCommandRepository,
    private readonly departmentMemberFactory: DepartmentMemberFactory,
  ) {}

  async addMember(
    departmentId: string,
    input: CreateDepartmentMemberInput,
  ): Promise<void> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) throw new NotFoundException('department not found');

    const existing =
      await this.departmentMemberCommandRepository.findByDepartmentAndDemoMember(
        departmentId,
        input.demoMemberId,
      );

    if (existing)
      throw new NotFoundException(
        'Demo member already exists in this department',
      );

    const member = this.departmentMemberFactory.createNew(
      departmentId,
      input.demoMemberId,
      DepartmentMemberRole.MEMBER,
      input.jobTitle,
    );
    await this.departmentMemberCommandRepository.save(member);
  }

  async updateMemberJobTitle(
    departmentId: string,
    memberId: string,
    input: UpdateDepartmentMemberInput,
  ): Promise<void> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) throw new NotFoundException('department not found');

    const member =
      await this.departmentMemberCommandRepository.findById(memberId);
    if (!member) throw new NotFoundException('Member not found');

    if (input.jobTitle) member.updateJobTitle(input.jobTitle);

    await this.departmentMemberCommandRepository.save(member);
  }

  async removeMember(departmentId: string, memberId: string): Promise<void> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) throw new NotFoundException('department not found');

    const member =
      await this.departmentMemberCommandRepository.findById(memberId);
    if (!member) throw new NotFoundException('Member not found');

    await this.departmentMemberCommandRepository.delete(memberId);
  }
}
