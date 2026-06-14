import { Injectable } from '@nestjs/common';
import { DemoResponseDto } from '../dto/demo-response.dto';

import { Demo as DomainDemo } from 'src/demos/domain/demo';
import { DepartmentResponseMapper } from './department-response.mapper';

import { Demo as PrismaDemo } from 'src/generated/prisma/client';

@Injectable()
export class DemoResponseMapper {
  constructor(private readonly departmentMapper: DepartmentResponseMapper) {}

  toResponseFromPrisma(demo: PrismaDemo): DemoResponseDto {
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

  toResponseManyFromPrisma(demos: PrismaDemo[]): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
