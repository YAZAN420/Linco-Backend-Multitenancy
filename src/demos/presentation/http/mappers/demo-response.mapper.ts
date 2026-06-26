import { Injectable } from '@nestjs/common';
import { DemoResponseDto } from '../dto/demo/demo-response.dto';

import { Demo as DomainDemo } from 'src/demos/domain/demo';
import { DepartmentResponseMapper } from './department-response.mapper';

import { DemoWithMemberCount } from 'src/core/database/prisma/types';

@Injectable()
export class DemoResponseMapper {
  constructor(private readonly departmentMapper: DepartmentResponseMapper) {}

  toResponseFromPrisma(demo: DemoWithMemberCount): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.createdAt,
      demo.updatedAt,
      demo._count.members,
    );
  }

  toResponseFromDomain(demo: DomainDemo): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.createdAt,
      demo.updatedAt,
    );
  }

  toResponseManyFromPrisma(demos: DemoWithMemberCount[]): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
