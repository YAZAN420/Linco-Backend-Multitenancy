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
    );
  }

  toResponseFromDomain(demo: DomainDemo): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.createdAt,
      demo.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    demos: PrismaDemoWithDepartments[],
  ): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
