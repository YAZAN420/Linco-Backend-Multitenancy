import { Injectable } from '@nestjs/common';
import type { Prisma, Demo as PrismaDemo } from 'src/generated/prisma/client';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDepartmentMapper } from './prisma-department.mapper';

export type DemoWithDepartments = Prisma.DemoGetPayload<{
  include: { departments: true };
}>;

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
      createdAt: demo.createdAt,
      updatedAt: demo.updatedAt,
      name: demo.name,
      ownerId: demo.ownerId,
    };
  }
}
