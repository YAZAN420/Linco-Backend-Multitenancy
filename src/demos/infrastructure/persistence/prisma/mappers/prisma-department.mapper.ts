import { Injectable } from '@nestjs/common';
import type { Department as PrismaDepartment } from 'src/generated/prisma/client';
import { Department } from 'src/demos/domain/department';
import { Name } from 'src/demos/domain/value-objects/name.vo';

@Injectable()
export class PrismaDepartmentMapper {
  toDomain(raw: PrismaDepartment): Department {
    const nameVo = Name.create(raw.name);
    return new Department(raw.id, {
      name: nameVo,
      isGroup: raw.isGroup,
      description: raw.description,
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
      isGroup: department.isGroup,
      description: department.description,
      managerId: department.managerId,
      demoId: department.demoId,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
