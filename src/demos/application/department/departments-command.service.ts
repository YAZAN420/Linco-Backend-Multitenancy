import { Injectable, NotFoundException } from '@nestjs/common';
import { DomainException } from 'src/common/exceptions/domain.exception';
import { DemoCommandRepository } from '../ports/demo/demo-command.repository';
import { DemoMemberCommandRepository } from '../ports/demo-member/demo-member-command.repository';
import { DepartmentFactory } from 'src/demos/domain/factories/department.factory';
import { CreateDepartmentInput } from './interfaces/create-department-input.interface';
import { UpdateDepartmentInput } from './interfaces/update-department-input.interface';
import { Name } from 'src/demos/domain/value-objects/name.vo';
import { DepartmentMemberFactory } from 'src/demos/domain/factories/department-member.factory';
import { DepartmentMemberCommandRepository } from '../ports/department-member/department-member-command.repository';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';

@Injectable()
export class DepartmentsCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly departmentFactory: DepartmentFactory,
    private readonly departmentMemberFactory: DepartmentMemberFactory,
    private readonly departmentCommandRepository: DepartmentMemberCommandRepository,
  ) {}

  async addDepartment(
    demoId: string,
    input: CreateDepartmentInput,
  ): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    if (input.managerId) {
      const member = await this.demoMemberCommandRepository.findById(
        input.managerId,
      );
      if (!member) {
        throw new NotFoundException('errors.MEMBER_NOT_FOUND');
      }
      if (member.demoId !== demoId) {
        throw new DomainException('errors.MANAGER_MUST_BE_A_MEMBER_OF_THIS_DEMO');
      }
    }

    const newDepartment = this.departmentFactory.createNew(
      demoId,
      input.name,
      input.managerId,
      input.description,
    );
    demo.addDepartment(newDepartment);

    await this.demoCommandRepository.save(demo);

    const departmentMember = this.departmentMemberFactory.createNew(
      newDepartment.id,
      input.managerId,
      DepartmentMemberRole.MANAGER,
      JobTitle.SENIOR,
    );

    await this.departmentCommandRepository.save(departmentMember);
  }

  async updateDepartment(
    demoId: string,
    departmentId: string,
    input: UpdateDepartmentInput,
  ): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    if (input.managerId !== undefined) {
      const member = await this.demoMemberCommandRepository.findById(
        input.managerId,
      );
      if (!member) throw new NotFoundException('errors.MEMBER_NOT_FOUND');
      if (member.demoId !== demoId) {
        throw new DomainException('errors.MANAGER_MUST_BE_A_MEMBER_OF_THIS_DEMO');
      }
      demo.reassignDepartmentManager(departmentId, input.managerId);
    }

    if (input.name !== undefined) {
      const nameVo = Name.create(input.name);
      demo.renameDepartment(departmentId, nameVo);
    }

    if (input.description !== undefined) {
      demo.updateDepartmentDescription(departmentId, input.description);
    }

    await this.demoCommandRepository.save(demo);
  }

  async removeDepartment(demoId: string, departmentId: string): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('errors.DEMO_NOT_FOUND');

    demo.removeDepartment(departmentId);
    await this.demoCommandRepository.save(demo);
  }
}
