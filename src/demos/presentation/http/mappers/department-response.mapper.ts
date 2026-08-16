import { Injectable } from '@nestjs/common';
import { DepartmentResponseDto } from '../dto/department/department-response.dto';
import { DepartmentWithDetails } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentResponseMapper {
  toResponseFromPrisma(
    department: DepartmentWithDetails,
  ): DepartmentResponseDto {
    return new DepartmentResponseDto(
      department.id,
      department.name,
      department.managerId,
      department.description,
      department.isGroup,
      department.createdAt,
      department.updatedAt,
      department._count.courses,
      department._count.members,
      department.isJoined,
    );
  }

  toResponseManyFromPrisma(
    departments: DepartmentWithDetails[],
  ): DepartmentResponseDto[] {
    return departments.map((dept) => this.toResponseFromPrisma(dept));
  }
}
