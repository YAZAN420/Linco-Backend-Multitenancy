import { Injectable } from '@nestjs/common';
import { DemoResponseDto } from '../dto/demo-response.dto';
import {
  Demo as PrismaDemo,
  Department as PrismaDepartment,
} from 'src/generated/prisma/client';
import { Demo as DomainDemo } from 'src/demos/domain/demo';
import { DepartmentResponseMapper } from './department-response.mapper';

type PrismaDemoWithDepartments = PrismaDemo & {
  departments?: PrismaDepartment[];
};

@Injectable()
export class DemoResponseMapper {
  constructor(private readonly departmentMapper: DepartmentResponseMapper) {}

  toResponseFromPrisma(demo: PrismaDemoWithDepartments): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.createdAt,
      demo.updatedAt,
      demo.departments
        ? demo.departments.map((dept) =>
            this.departmentMapper.toResponseFromPrisma(dept),
          )
        : undefined,
    );
  }

  toResponseFromDomain(demo: DomainDemo): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.createdAt,
      demo.updatedAt,
      demo.departments && demo.departments.length > 0
        ? demo.departments.map((dept) =>
            this.departmentMapper.toResponseFromDomain(dept),
          )
        : undefined,
    );
  }

  toResponseManyFromPrisma(
    demos: PrismaDemoWithDepartments[],
  ): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
