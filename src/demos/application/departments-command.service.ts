import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoCommandRepository } from './ports/demo-command.repository';
import { DepartmentFactory } from '../domain/factories/department.factory';
import { CreateDepartmentInput } from './interfaces/create-department-input.interface';
import { UpdateDepartmentInput } from './interfaces/update-department-input.interface';
import { DomainValidationException } from '../domain/exceptions/validation.exception';
import { DemoMemberCommandRepository } from './ports/demo-member-command.repository';

@Injectable()
export class DepartmentsCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly departmentFactory: DepartmentFactory,
  ) {}

  async addDepartment(
    demoId: string,
    input: CreateDepartmentInput,
  ): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    if (input.managerId) {
      const member = await this.demoMemberCommandRepository.findById(
        input.managerId,
      );
      if (!member) {
        throw new NotFoundException('Member not found');
      }
      if (member.demoId !== demoId) {
        throw new DomainValidationException(
          'Manager must be a member of this demo',
        );
      }
    }

    const newDepartment = this.departmentFactory.createNew(demoId, input);
    demo.addDepartment(newDepartment);

    await this.demoCommandRepository.save(demo);
  }

  async updateDepartment(
    demoId: string,
    departmentId: string,
    input: UpdateDepartmentInput,
  ): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    if (input.managerId !== undefined) {
      const member = await this.demoMemberCommandRepository.findById(
        input.managerId,
      );
      if (!member) throw new NotFoundException('Member not found');
      if (member.demoId !== demoId) {
        throw new DomainValidationException(
          'Manager must be a member of this demo',
        );
      }
      demo.reassignDepartmentManager(departmentId, input.managerId);
    }

    if (input.name !== undefined) {
      demo.renameDepartment(departmentId, input.name);
    }

    await this.demoCommandRepository.save(demo);
  }

  async removeDepartment(demoId: string, departmentId: string): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    demo.removeDepartment(departmentId);
    await this.demoCommandRepository.save(demo);
  }
}
