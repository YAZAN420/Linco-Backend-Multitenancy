import { Injectable } from '@nestjs/common';
import type { Department as PrismaDepartment } from 'src/generated/prisma/client';
import { Department } from 'src/demos/domain/department';

@Injectable()
export class PrismaDepartmentMapper {
  toDomain(raw: PrismaDepartment): Department {
    return new Department(raw.id, {
      name: raw.name,
      managerId: raw.managerId,
      demoId: raw.demoId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(department: Department): PrismaDepartment {
    return {
      id: department.id,
      name: department.name,
      managerId: department.managerId,
      demoId: department.demoId,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
