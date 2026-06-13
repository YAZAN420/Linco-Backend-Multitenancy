import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Department } from '../department';

@Injectable()
export class DepartmentFactory {
  createNew(demoId: string, name: string, managerId: string): Department {
    const now = new Date();
    return new Department(uuidv7(), {
      name,
      managerId,
      demoId: demoId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
