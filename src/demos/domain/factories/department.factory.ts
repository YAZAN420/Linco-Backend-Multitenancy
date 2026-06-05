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

  reconstitute(
    id: string,
    props: {
      name: string;
      demoId: string;
      managerId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ): Department {
    return new Department(id, props);
  }
}
