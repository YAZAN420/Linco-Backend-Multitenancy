import { Injectable } from '@nestjs/common';
import type { Demo as PrismaDemo } from 'src/generated/prisma/client';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDepartmentMapper } from './prisma-department.mapper';
import { DemoWithDepartments } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaDemoMapper {
  constructor(private readonly departmentMapper: PrismaDepartmentMapper) {}

  toDomain(raw: DemoWithDepartments): Demo {
    return new Demo(raw.id, {
      name: raw.name,
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
      ownerId: demo.ownerId,
      createdAt: demo.createdAt,
      updatedAt: demo.updatedAt,
    };
  }
}
