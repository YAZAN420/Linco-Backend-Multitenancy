import { Injectable, NotFoundException } from '@nestjs/common';
import { DemoCommandRepository } from './ports/demo-command.repository';
import { DepartmentFactory } from '../domain/factories/department.factory';
import { CreateDepartmentInput } from './interfaces/create-department-input.interface';
import { UpdateDepartmentInput } from './interfaces/update-department-input.interface';

@Injectable()
export class DepartmentsCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly departmentFactory: DepartmentFactory,
  ) {}

  async addDepartment(
    demoId: string,
    input: CreateDepartmentInput,
  ): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

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

    demo.updateDepartment(departmentId, {
      name: input.name,
      managerId: input.managerId,
    });

    await this.demoCommandRepository.save(demo);
  }

  async removeDepartment(demoId: string, departmentId: string): Promise<void> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    demo.removeDepartment(departmentId);
    await this.demoCommandRepository.save(demo);
  }
}
