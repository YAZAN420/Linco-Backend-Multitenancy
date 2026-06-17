import { Injectable } from '@nestjs/common';
import { DepartmentCourseResponseDto } from '../dto/departmentCourse-response.dto';
import { DepartmentCourse as PrismaDepartmentCourse } from 'src/generated/prisma/client';
import { DepartmentCourse as DomainDepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';

@Injectable()
export class DepartmentCourseResponseMapper {
  toResponseFromPrisma(departmentCourse: PrismaDepartmentCourse): DepartmentCourseResponseDto {
    return new DepartmentCourseResponseDto(
      departmentCourse.id,
      departmentCourse.createdAt,
      departmentCourse.updatedAt,
    );
  }

  toResponseFromDomain(departmentCourse: DomainDepartmentCourse): DepartmentCourseResponseDto {
    return new DepartmentCourseResponseDto(
      departmentCourse.id,
      departmentCourse.createdAt,
      departmentCourse.updatedAt,
    );
  }

  toResponseManyFromPrisma(departmentCourses: PrismaDepartmentCourse[]): DepartmentCourseResponseDto[] {
    return departmentCourses.map((departmentCourse) => this.toResponseFromPrisma(departmentCourse));
  }
}
