import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Department } from '../department';
import { CreateDepartmentInput } from 'src/demos/application/interfaces/create-department-input.interface';

@Injectable()
export class DepartmentFactory {
  createNew(demoId: string, input: CreateDepartmentInput): Department {
    const now = new Date();
    return new Department(uuidv7(), {
      name: input.name,
      demoId: demoId,
      managerId: input.managerId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
