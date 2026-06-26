import { Injectable } from '@nestjs/common';
import { Department as PrismaDepartment } from 'src/generated/prisma/client';
import { Department as DomainDepartment } from 'src/demos/domain/department';
import { DepartmentResponseDto } from '../dto/department/department-response.dto';

@Injectable()
export class DepartmentResponseMapper {
  toResponseFromPrisma(department: PrismaDepartment): DepartmentResponseDto {
    return new DepartmentResponseDto(
      department.id,
      department.name,
      department.managerId,
      department.description,
      department.createdAt,
      department.updatedAt,
    );
  }

  toResponseFromDomain(department: DomainDepartment): DepartmentResponseDto {
    return new DepartmentResponseDto(
      department.id,
      department.name,
      department.managerId,
      department.description,
      department.createdAt,
      department.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    departments: PrismaDepartment[],
  ): DepartmentResponseDto[] {
    return departments.map((dept) => this.toResponseFromPrisma(dept));
  }
}
