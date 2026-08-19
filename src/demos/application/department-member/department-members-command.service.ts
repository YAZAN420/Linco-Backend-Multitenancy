import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMemberFactory } from 'src/demos/domain/factories/department-member.factory';
import { DepartmentMemberCommandRepository } from '../ports/department-member/department-member-command.repository';
import { CreateDepartmentMemberInput } from './interfaces/create-department-member-input.interface';
import { UpdateDepartmentMemberInput } from './interfaces/update-department-member-input.interface';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';

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
    if (!department) throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');

    const existing =
      await this.departmentMemberCommandRepository.findByDepartmentAndDemoMember(
        departmentId,
        input.demoMemberId,
      );

    if (existing)
      throw new NotFoundException(
        'errors.DEMO_MEMBER_ALREADY_EXISTS_IN_THIS_DEPARTMENT',
      );

    const member = this.departmentMemberFactory.createNew(
      departmentId,
      input.demoMemberId,
      input.role ? input.role : DepartmentMemberRole.MEMBER,
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
    if (!department) throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');

    const member =
      await this.departmentMemberCommandRepository.findById(memberId);
    if (!member) throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    if (input.jobTitle) member.updateJobTitle(input.jobTitle);

    await this.departmentMemberCommandRepository.save(member);
  }

  async removeMember(departmentId: string, memberId: string): Promise<void> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');

    const member =
      await this.departmentMemberCommandRepository.findById(memberId);
    if (!member) throw new NotFoundException('errors.MEMBER_NOT_FOUND');

    await this.departmentMemberCommandRepository.delete(memberId);
  }
}
