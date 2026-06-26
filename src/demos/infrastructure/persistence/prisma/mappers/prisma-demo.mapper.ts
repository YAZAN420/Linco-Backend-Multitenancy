import { Injectable } from '@nestjs/common';
import type { Demo as PrismaDemo } from 'src/generated/prisma/client';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDepartmentMapper } from './prisma-department.mapper';
import { DemoWithDepartments } from 'src/core/database/prisma/types';
import { Name } from 'src/demos/domain/value-objects/name.vo';

@Injectable()
export class PrismaDemoMapper {
  constructor(private readonly departmentMapper: PrismaDepartmentMapper) {}

  toDomain(raw: DemoWithDepartments): Demo {
    const nameVo = Name.create(raw.name);
    return new Demo(raw.id, {
      name: nameVo,
      imagePath: raw.imagePath,
      description: raw.description,
      ownerId: raw.ownerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      departments: raw.departments
        ? raw.departments.map((dept) => this.departmentMapper.toDomain(dept))
        : [],
    });
  }

  toPersistence(demo: Demo): PrismaDemo {
    return {
      id: demo.id,
      name: demo.name,
      imagePath: demo.imagePath,
      description: demo.description,
      ownerId: demo.ownerId,
      createdAt: demo.createdAt,
      updatedAt: demo.updatedAt,
    };
  }
}
