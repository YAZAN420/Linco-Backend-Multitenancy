import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Department } from '../department';
import { Name } from '../value-objects/name.vo';

@Injectable()
export class DepartmentFactory {
  createNew(
    demoId: string,
    name: string,
    managerId: string,
    description: string,
  ): Department {
    const now = new Date();
    const nameVo = Name.create(name);
    return new Department(uuidv7(), {
      name: nameVo,
      description,
      managerId,
      demoId: demoId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
